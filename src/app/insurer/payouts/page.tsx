import InsurerLayout from "@/components/layout/InsurerLayout";
import { getApprovedClaimsForPayout } from "@/lib/actions/financeActions";
import PayoutTable from "@/components/insurer/PayoutTable";
import { 
  BanknotesIcon, 
  ClockIcon, 
  CheckBadgeIcon 
} from "@heroicons/react/24/outline";

export default async function PayoutsPage() {
  const claims = await getApprovedClaimsForPayout();

  const totalAwaiting = claims.reduce((sum: number, c: any) => sum + (c.approvedAmount || 0), 0);

  return (
    <InsurerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Settlements</h1>
          <p className="text-gray-500 mt-1">Manage and authorize payouts for approved medical claims.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-emerald-500 text-white border-none shadow-lg">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Awaiting Payout</p>
            <h3 className="text-4xl font-black mt-2 font-mono">₹{totalAwaiting.toLocaleString()}</h3>
          </div>
          <div className="card">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Queue</p>
            <h3 className="text-4xl font-black text-gray-800 mt-2">{claims.length} <span className="text-xs text-gray-400 font-bold ml-1 italic">Claims</span></h3>
          </div>
          <div className="card bg-gray-900 border-none">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Avg. Settlement Time</p>
            <h3 className="text-4xl font-black text-white mt-2">12.5 <span className="text-xs text-gray-500 font-bold ml-1 italic">Hours</span></h3>
          </div>
        </div>

        <PayoutTable initialClaims={claims} />
      </div>
    </InsurerLayout>
  );
}
