import { Octokit } from "octokit";

export interface ContributionDay {
  date: string;
  count: number;
}

export interface GitHubStreakData {
  heatmap: ContributionDay[];
  streak: number;
}

export async function fetchGitHubStreak(): Promise<GitHubStreakData> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return { heatmap: [], streak: 0 };
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const login =
    process.env.REPO_OWNER || process.env.GITHUB_USERNAME || "ssyy3034";

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
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
    const response: any = await octokit.graphql(query, { login });

    if (!response.user) return { heatmap: [], streak: 0 };

    const weeks =
      response.user.contributionsCollection?.contributionCalendar?.weeks || [];
    const heatmap: ContributionDay[] = [];

    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        heatmap.push({ date: day.date, count: day.contributionCount });
      });
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sorted = [...heatmap].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    for (const day of sorted) {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays <= streak + 1 && day.count > 0) {
        streak++;
      } else if (diffDays > streak + 1) {
        break;
      }
    }

    return { heatmap, streak };
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return { heatmap: [], streak: 0 };
  }
}
