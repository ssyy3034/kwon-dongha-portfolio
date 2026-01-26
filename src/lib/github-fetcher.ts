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
    console.warn("GITHUB_TOKEN not set. Fallback to basic data.");
    // Return mock data or empty if GraphQL is strictly required,
    // but let's check if we can skip the token check for non-essential calls if needed.
    return [];
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  // Get authenticated user if username not provided
  const GITHUB_USERNAME =
    username ||
    process.env.VERCEL_GIT_REPO_OWNER ||
    process.env.REPO_OWNER ||
    "ssyy3034";
  let login = GITHUB_USERNAME; // Initialize login with the determined username

  if (!login) {
    // This condition might now be redundant if GITHUB_USERNAME always has a value
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
