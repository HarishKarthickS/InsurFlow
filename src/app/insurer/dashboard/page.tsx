import InsurerLayout from "@/components/layout/InsurerLayout";
import { getQueuedClaims } from "@/lib/actions/adjudicationActions";
import { getTeamMembers } from "@/lib/actions/teamActions";
import AdjudicationQueue from "@/components/insurer/AdjudicationQueue";
import AnalyticsDashboard from "@/components/insurer/AnalyticsDashboard";
import Link from "next/link";
import { 
  PlusIcon, 
  DocumentArrowUpIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

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
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Claims Command Center</h1>
            <p className="text-gray-500 mt-1">Monitor and adjudicate incoming insurance claims across your organization.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/insurer/manual-entry" 
              className="btn btn-secondary inline-flex items-center gap-2 shadow-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Manual Digitization
            </Link>
          </div>
        </div>

        {/* B2B Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-primary text-white border-none shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Total Active Claims</p>
                <h3 className="text-4xl font-black mt-2">{metrics.total}</h3>
              </div>
              <DocumentArrowUpIcon className="h-12 w-12 opacity-20" />
            </div>
          </div>

          <div className="card border-l-4 border-l-danger bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Flagged Risk</p>
                <h3 className="text-4xl font-black text-danger mt-2">{metrics.highRisk}</h3>
              </div>
              <ShieldCheckIcon className="h-12 w-12 text-danger opacity-10" />
            </div>
          </div>

          <div className="card bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Awaiting Decision</p>
                <h3 className="text-4xl font-black text-warning mt-2">{metrics.pending}</h3>
              </div>
              <ChartBarIcon className="h-12 w-12 text-warning opacity-10" />
            </div>
          </div>
        </div>

        <AnalyticsDashboard claims={claims} />

        <AdjudicationQueue claims={claims} team={team} />
      </div>
    </InsurerLayout>
  );
}
