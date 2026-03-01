import { fetchDashboardData } from '@/lib/graph-loader';
import Dashboard from '@/components/Dashboard';

export const revalidate = 3600;

export default async function VersionedHome() {
  const data = await fetchDashboardData();

  return (
    <main>
      <Dashboard data={data} />
    </main>
  );
}
