import { Octokit } from "octokit";

export interface ContributionDay {
  date: string;
  count: number;
}

export async function fetchGitHubContributions(
  username?: string,
): Promise<ContributionDay[]> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    console.warn("GITHUB_TOKEN not set in process.env. Returning empty.");
    return [];
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  // Get authenticated user if username not provided
  let login = username || process.env.REPO_OWNER;
  if (!login) {
    try {
      const { data: user } = await octokit.rest.users.getAuthenticated();
      login = user.login;
    } catch (e) {
      console.error(
        "Could not get authenticated user and no username provided.",
      );
      return [];
    }
  }

  console.log(`Fetching GitHub contributions for: ${login}`);

  // Fetch contribution data using GraphQL
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
    const response: any = await octokit.graphql(query, { login });

    if (!response.user) {
      console.warn(`No GitHub user found with login: ${login}`);
      return [];
    }

    const weeks =
      response.user.contributionsCollection?.contributionCalendar?.weeks || [];
    const contributions: ContributionDay[] = [];

    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      });
    });

    console.log(
      `Successfully fetched ${contributions.length} days of contributions for ${login}`,
    );
    return contributions;
  } catch (error) {
    console.error(`Failed to fetch GitHub contributions for ${login}:`, error);
    return [];
  }
}

export async function fetchGitHubStats(username?: string): Promise<{
  totalContributions: number;
  currentStreak: number;
}> {
  const contributions = await fetchGitHubContributions(username);

  const totalContributions = contributions.reduce(
    (sum, day) => sum + day.count,
    0,
  );

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort contributions by date descending
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const day of sorted) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    // Allow for today or yesterday to start the streak
    const diffDays = Math.floor(
      (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= currentStreak + 1 && day.count > 0) {
      currentStreak++;
    } else if (diffDays > currentStreak + 1) {
      break;
    }
  }

  return { totalContributions, currentStreak };
}
