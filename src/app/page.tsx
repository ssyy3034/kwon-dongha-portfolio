import { fetchGitHubStreak } from '@/lib/github-fetcher';
import Dashboard from '@/components/Dashboard';

export const revalidate = 3600;

export default async function Home() {
  const streakData = await fetchGitHubStreak();

  return (
    <main>
      <Dashboard streakData={streakData} />
    </main>
  );
}
