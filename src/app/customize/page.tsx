import { fetchDashboardData } from "@/lib/graph-loader";
import StudioClient from "@/components/studio/StudioClient";

export const dynamic = "force-dynamic";

export default async function CustomizePage() {
  const data = await fetchDashboardData();

  return <StudioClient initialData={data} />;
}
