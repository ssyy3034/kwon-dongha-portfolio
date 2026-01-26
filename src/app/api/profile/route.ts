import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const password = request.headers.get("x-studio-password");

    // 1. Authentication Check
    const STUDIO_PASSWORD = process.env.STUDIO_PASSWORD || "admin123"; // Default for dev, should be env in prod
    if (password !== STUDIO_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Security Key" },
        { status: 401 },
      );
    }

    const configPath = "src/config/profile.json";
    const absoluteConfigPath = path.join(process.cwd(), configPath);

    // 2. Environment-based Persistence
    if (process.env.NODE_ENV === "development") {
      // Local Dev: Direct file system write
      await fs.writeFile(
        absoluteConfigPath,
        JSON.stringify(data, null, 2),
        "utf-8",
      );
      return NextResponse.json({
        message: "Successfully saved to local source",
        mode: "local",
      });
    } else {
      // Production (Vercel): Git-as-a-CMS via GitHub API
      // Since we can't write to Vercel's FS, we commit the change to GitHub.
      // Vercel will then detect the push and redeploy automatically.

      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      const REPO_OWNER = process.env.REPO_OWNER;
      const REPO_NAME = process.env.REPO_NAME;

      if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
        return NextResponse.json(
          {
            error:
              "Git-CMS not configured. Please set GITHUB_TOKEN, REPO_OWNER, and REPO_NAME.",
          },
          { status: 500 },
        );
      }

      // a. Get current file SHA
      const getFileRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${configPath}`,
        {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        },
      );

      if (!getFileRes.ok)
        throw new Error("Failed to fetch file SHA from GitHub");
      const fileData = await getFileRes.json();

      // b. Update file on GitHub
      const updateRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${configPath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "feat(profile): identity updated via Identity Studio",
            content: Buffer.from(JSON.stringify(data, null, 2)).toString(
              "base64",
            ),
            sha: fileData.sha,
          }),
        },
      );

      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.message || "Failed to commit to GitHub");
      }

      return NextResponse.json({
        message: "Changes committed to GitHub. Site will redeploy shortly.",
        mode: "git",
      });
    }
  } catch (error: any) {
    console.error("Studio Persistence Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to persist changes" },
      { status: 500 },
    );
  }
}
