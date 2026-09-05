import InsurerLayout from "@/components/layout/InsurerLayout";
import { getApprovedClaimsForPayout } from "@/lib/actions/financeActions";
import PayoutTable from "@/components/insurer/PayoutTable";

export default async function PayoutsPage() {
  const claims = await getApprovedClaimsForPayout();

  const totalAwaiting = claims.reduce((sum: number, c: any) => sum + (c.approvedAmount || 0), 0);

  return (
    <InsurerLayout>
      <div className="space-y-5">
        <div>
          <p className="section-kicker">Finance tray</p>
          <h1 className="text-3xl">Settlements</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Authorize payouts for stamped-approved files.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="metric-tile bg-rail text-folder">
            <p className="font-display text-[11px] tracking-[0.14em] uppercase text-[#8fa0ab]">Awaiting payout</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">₹{totalAwaiting.toLocaleString()}</p>
          </div>
          <div className="metric-tile">
            <p className="section-kicker">Approved queue</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">{claims.length}</p>
          </div>
          <div className="metric-tile">
            <p className="section-kicker">Avg. settlement</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">12.5<span className="text-sm ml-1">h</span></p>
          </div>
        </div>

        <PayoutTable initialClaims={claims} />
      </div>
    </InsurerLayout>
  );
}
