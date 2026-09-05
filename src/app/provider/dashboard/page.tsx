import ProviderLayout from "@/components/layout/ProviderLayout";
import { getProviderClaims } from "@/lib/actions/providerActions";
import { 
  CheckBadgeIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import StatusStamp from "@/components/ui/StatusStamp";

export default async function ProviderDashboard() {
  const claims = await getProviderClaims();

  const totalClaimed = claims.reduce((sum: number, c: any) => sum + c.claimAmount, 0);
  const totalSettled = claims.filter((c: any) => c.payoutStatus === 'settled').length;

  return (
    <ProviderLayout>
      <div className="space-y-5">
        <div>
          <p className="section-kicker">Facility intake</p>
          <h1 className="text-3xl">Submitted files</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Track bills lodged with the carrier desk.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="metric-tile">
            <p className="section-kicker">Submissions</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">{claims.length}</p>
          </div>
          <div className="metric-tile">
            <p className="section-kicker">Billed total</p>
            <p className="font-mono text-2xl mt-1 tabular-nums">₹{totalClaimed.toLocaleString()}</p>
          </div>
          <div className="metric-tile bg-rail text-folder">
            <p className="font-display text-[11px] tracking-[0.14em] uppercase text-[#8fa0ab]">Settled</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">{totalSettled}</p>
          </div>
          <div className="metric-tile">
            <p className="section-kicker">Avg. desk time</p>
            <p className="font-mono text-3xl mt-1 tabular-nums">4.2<span className="text-sm ml-1">d</span></p>
          </div>
        </div>

        <div className="queue-board overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Amount</th>
                <th>Stamp</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim: any) => (
                <tr key={claim._id}>
                  <td>
                    <div className="font-medium">{claim.patientName}</div>
                    <div className="file-id">FILE-{claim._id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td>
                    <div className="font-mono text-sm tabular-nums">₹{claim.claimAmount.toLocaleString()}</div>
                    {claim.approvedAmount && (
                      <div className="file-id text-success">Auth ₹{claim.approvedAmount.toLocaleString()}</div>
                    )}
                  </td>
                  <td>
                    <StatusStamp status={claim.status} />
                  </td>
                  <td>
                    {claim.payoutStatus === 'settled' ? (
                      <span className="inline-flex items-center gap-1 text-sm text-success">
                        <CheckBadgeIcon className="h-4 w-4" /> Settled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-[#8fa0ab]">
                        <ClockIcon className="h-4 w-4" /> Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[#4a5f69] text-sm">
                    No files from this facility yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProviderLayout>
  );
}
