import ProviderLayout from "@/components/layout/ProviderLayout";
import { getProviderClaims } from "@/lib/actions/providerActions";
import { 
  CurrencyRupeeIcon, 
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const StatusPill = ({ status }: { status: string }) => {
  const styles: any = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejected: 'bg-rose-50 text-rose-700 border-rose-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || 'bg-slate-50 text-slate-500'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default async function ProviderDashboard() {
  const claims = await getProviderClaims();

  const totalClaimed = claims.reduce((sum: number, c: any) => sum + c.claimAmount, 0);
  const totalSettled = claims.filter((c: any) => c.payoutStatus === 'settled').length;

  return (
    <ProviderLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">PROVIDER DASHBOARD</h1>
          <p className="text-slate-500 font-medium">Track your medical claims and automated settlements.</p>
        </div>

        {/* Provider Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Submissions</p>
            <h3 className="text-3xl font-black text-slate-900">{claims.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Value</p>
            <h3 className="text-3xl font-black text-slate-900 font-mono italic">₹{totalClaimed.toLocaleString()}</h3>
          </div>
          <div className="bg-emerald-500 p-6 rounded-2xl shadow-lg shadow-emerald-500/20 text-white border-none">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-2">Paid Settlements</p>
            <h3 className="text-3xl font-black">{totalSettled}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Adjudication</p>
            <h3 className="text-3xl font-black text-slate-900">4.2<span className="text-xs font-bold ml-1 text-slate-400">days</span></h3>
          </div>
        </div>

        {/* Claims Table */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5 text-emerald-500" />
            Recent Activity
          </h2>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decision</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {claims.map((claim: any) => (
                  <tr key={claim._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{claim.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">#{claim._id.slice(-8)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-700 font-mono">₹{claim.claimAmount.toLocaleString()}</div>
                      {claim.approvedAmount && <div className="text-[10px] text-emerald-500 font-bold mt-1 tracking-tight">Approved: ₹{claim.approvedAmount.toLocaleString()}</div>}
                    </td>
                    <td className="px-8 py-6">
                      <StatusPill status={claim.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {claim.payoutStatus === 'settled' ? (
                          <>
                            <CheckBadgeIcon className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-bold text-slate-600">Settled</span>
                          </>
                        ) : (
                          <>
                            <ClockIcon className="h-4 w-4 text-slate-300" />
                            <span className="text-xs font-bold text-slate-400 italic">Processing</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {claims.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                      No claims found for your facility. Start by submitting your first claim.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
