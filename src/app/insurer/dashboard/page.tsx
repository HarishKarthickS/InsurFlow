import InsurerLayout from "@/components/layout/InsurerLayout";
import { getQueuedClaims } from "@/lib/actions/adjudicationActions";
import { getTeamMembers } from "@/lib/actions/teamActions";
import AdjudicationQueue from "@/components/insurer/AdjudicationQueue";
import AnalyticsDashboard from "@/components/insurer/AnalyticsDashboard";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function InsurerDashboard() {
  const claims = await getQueuedClaims();
  const team = await getTeamMembers();

  const metrics = {
    total: claims.length,
    highRisk: claims.filter((c: any) => c.riskLevel === 'high' || c.riskLevel === 'critical').length,
    pending: claims.filter((c: any) => c.status === 'pending' || c.status === 'in_review').length,
  };

  return (
    <InsurerLayout>
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Live intake</p>
            <h1 className="text-3xl mt-0.5">Claims queue</h1>
            <p className="text-sm text-[#4a5f69] mt-1">Hanging files awaiting stamp. Assign, open, decide.</p>
          </div>
          <Link href="/insurer/manual-entry" className="btn btn-secondary">
            <PlusIcon className="h-4 w-4" />
            Digitize a bill
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="metric-tile bg-rail text-folder">
            <p className="font-display text-[11px] tracking-[0.14em] uppercase text-[#8fa0ab]">Open files</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">{metrics.total}</p>
          </div>
          <div className="metric-tile">
            <p className="section-kicker">High-risk flags</p>
            <p className="font-mono text-3xl text-danger mt-1 tabular-nums">{metrics.highRisk}</p>
          </div>
          <div className="metric-tile">
            <p className="section-kicker">Awaiting stamp</p>
            <p className="font-mono text-3xl text-warning mt-1 tabular-nums">{metrics.pending}</p>
          </div>
        </div>

        <AnalyticsDashboard claims={claims} />

        <AdjudicationQueue claims={claims} team={team} />
      </div>
    </InsurerLayout>
  );
}
