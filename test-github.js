
const { Octokit } = require("octokit");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const login = "ssyy3034";

async function test() {
  console.log("Testing GitHub API with token:", GITHUB_TOKEN ? "FOUND" : "MISSING");
  if (!GITHUB_TOKEN) return;

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql(query, { login });
    console.log("Success!");
    console.log("Total Contributions:", response.user.contributionsCollection.contributionCalendar.totalContributions);
    const days = response.user.contributionsCollection.contributionCalendar.weeks.flatMap(w => w.contributionDays);
    const activeDays = days.filter(d => d.contributionCount > 0);
    console.log("Active Days found:", activeDays.length);
    if (activeDays.length > 0) {
      console.log("Sample Active Day:", activeDays[0]);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

test();
