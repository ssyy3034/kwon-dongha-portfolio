import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { evaluateCompetency, CompetencyScore } from "./competency-evaluator";
import { fetchGitHubContributions, fetchGitHubStats } from "./github-fetcher";

const LOCAL_CONTENT_PATH = path.join(process.cwd(), "study");

export interface GraphNode {
  id: string;
  name: string;
  group: string;
  val: number;
  date: string;
  preview?: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface HeatmapData {
  date: string;
  count: number;
  commits: number;
  posts: number;
}

export interface DashboardData {
  nodes: GraphNode[];
  links: GraphLink[];
  heatmap: HeatmapData[];
  radar: CompetencyScore[];
  recentPosts: GraphNode[];
  totalPosts: number;
  streak: number;
  missingTopics: { category: string; keywords: string[] }[];
  graphStats: {
    groupByCount: Record<string, number>;
    firstDate: string;
    lastDate: string;
  };
}

// Alias for KnowledgeGraph compatibility
export type GraphData = DashboardData;

async function getLocalMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  const files = await glob("**/*.md", {
    cwd: dir,
    ignore: ["**/.obsidian/**", "**/.*/**"],
    absolute: true,
    nodir: true,
  });

  return files
    .map((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const id = path.basename(filePath, ".md");
        const stats = fs.statSync(filePath);
        return { id, content, created: stats.birthtime };
      } catch {
        return null;
      }
    })
    .filter((f) => f !== null) as {
    id: string;
    content: string;
    created: Date;
  }[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const rawFiles = await getLocalMarkdownFiles(LOCAL_CONTENT_PATH);

  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const dateMap: Record<string, number> = {};

  const docsForEval: {
    content: string;
    length: number;
    hasCodeBlock: boolean;
    linkCount: number;
  }[] = [];

  rawFiles.forEach((file) => {
    const { data, content } = matter(file.content);
    const matches = [...content.matchAll(/\[\[(.*?)\]\]/g)];

    docsForEval.push({
      content: content,
      length: content.length,
      hasCodeBlock: content.includes("```"),
      linkCount: matches.length,
    });

    let group = "Uncategorized";
    if (data.tags) group = Array.isArray(data.tags) ? data.tags[0] : data.tags;

    let dateStr = "2025-01-01";
    if (data.date) dateStr = new Date(data.date).toISOString().split("T")[0];
    else if (file.created) dateStr = file.created.toISOString().split("T")[0];

    dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;

    const preview = content.slice(0, 100).replace(/[#*`]/g, "") + "...";

    nodes.push({
      id: file.id,
      name: data.title || file.id,
      group,
      val: 1 + matches.length,
      date: dateStr,
      preview,
    });

    matches.forEach((match) => {
      const target = match[1].split("|")[0].split("#")[0].trim();
      links.push({ source: file.id, target });
    });
  });

  // --- GITHUB INTEGRATION ---
  // Fetch GitHub contributions and merge with local data
  const GITHUB_USERNAME =
    process.env.REPO_OWNER || process.env.GITHUB_USERNAME || "ssyy3034";

  const [githubContributions, githubStats] = await Promise.all([
    fetchGitHubContributions(GITHUB_USERNAME),
    fetchGitHubStats(GITHUB_USERNAME),
  ]);

  // Merge GitHub contributions into heatmap (prioritize GitHub data)
  const heatmapMap: Record<
    string,
    { count: number; commits: number; posts: number }
  > = {};

  // Add local markdown data first
  Object.entries(dateMap).forEach(([date, count]) => {
    if (!heatmapMap[date])
      heatmapMap[date] = { count: 0, commits: 0, posts: 0 };
    heatmapMap[date].count += count;
    heatmapMap[date].posts += count;
  });

  // Add GitHub contributions
  githubContributions.forEach(({ date, count }) => {
    if (!heatmapMap[date])
      heatmapMap[date] = { count: 0, commits: 0, posts: 0 };
    heatmapMap[date].count += count;
    heatmapMap[date].commits += count;
  });

  const heatmap: HeatmapData[] = Object.entries(heatmapMap)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // --- INTEGRATED STREAK CALCULATION ---
  // Calculate streak from merged data (GitHub + Local)
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedHeatmapDesc = [...heatmap].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const day of sortedHeatmapDesc) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Allow for today or yesterday to start/continue the streak
    if (diffDays <= streak + 1 && day.count > 0) {
      streak++;
    } else if (diffDays > streak + 1) {
      break;
    }
  }

  // Stats for Consistency (using local data for competency eval)
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  let activeDaysLastMonth = 0;
  Object.keys(heatmapMap).forEach((d) => {
    const date = new Date(d);
    if (date >= thirtyDaysAgo && date <= today) activeDaysLastMonth++;
  });

  // Evaluate Competency with Stats
  const radar = evaluateCompetency(docsForEval, {
    totalDocs: nodes.length,
    streak: streak,
    activeDaysLastMonth: activeDaysLastMonth,
  });

  const missingTopics = radar
    .filter((r) => r.category !== "학습 성실도")
    .map((r) => ({
      category: r.category,
      keywords: r.missingKeywords.slice(0, 5),
      score: r.score,
    }))
    .filter((m) => m.keywords.length > 0)
    .sort((a, b) => a.score - b.score) // 점수 낮은 순 (우선 학습 필요)
    .slice(0, 3);

  const recentPosts = [...nodes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Calculate Graph Stats
  const groupByCount: Record<string, number> = {};
  nodes.forEach((node) => {
    groupByCount[node.group] = (groupByCount[node.group] || 0) + 1;
  });

  const sortedDates = Object.keys(dateMap).sort();
  const firstDate = sortedDates[0] || "2024-01-01";
  const lastDate =
    sortedDates[sortedDates.length - 1] ||
    new Date().toISOString().split("T")[0];

  return {
    nodes,
    links,
    heatmap,
    radar,
    recentPosts,
    totalPosts: nodes.length, // 문서화된 포스트 수만 카운트 (커밋과 분리)
    streak,
    missingTopics,
    graphStats: {
      groupByCount,
      firstDate,
      lastDate,
    },
  };
}
