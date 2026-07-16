import { buildLiveDashboard } from "@/features/market-data/live";
import { buildMockDashboard } from "@/features/market-data/mock";

export async function getDashboardData() {
  if (process.env.DATA_MODE === "live") {
    return buildLiveDashboard();
  }

  return buildMockDashboard();
}
