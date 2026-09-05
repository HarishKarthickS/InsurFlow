import ProviderLayout from "@/components/layout/ProviderLayout";
import { getProviderPayouts } from "@/lib/actions/providerActions";
import { 
  CreditCardIcon, 
  CalendarDaysIcon,
  DocumentMagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import StatusStamp from "@/components/ui/StatusStamp";

export default async function ProviderPayoutsPage() {
  const payouts = await getProviderPayouts();

  return (
    <ProviderLayout>
      <div className="space-y-5">
        <div>
          <p className="section-kicker">Finance</p>
          <h1 className="text-3xl">Settlement history</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Authorized payouts against stamped files.</p>
        </div>

        <div className="space-y-3">
          {payouts.map((p: any) => (
            <div key={p._id} className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xl tabular-nums">₹{p.approvedAmount.toLocaleString()}</p>
                <p className="section-kicker mt-1">Authorized settlement</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-[#4a5f69]">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {new Date(p.settledDate).toLocaleDateString()}
                  </span>
                  <span className="file-id">{p.payoutReference}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusStamp status="approved" label="Settled" />
                <div className="text-right hidden md:block">
                  <p className="section-kicker">Linked file</p>
                  <p className="file-id">FILE-{p._id.slice(-10).toUpperCase()}</p>
                </div>
                <DocumentMagnifyingGlassIcon className="h-5 w-5 text-[#8fa0ab]" />
              </div>
            </div>
          ))}

          {payouts.length === 0 && (
            <div className="card p-12 text-center">
              <CreditCardIcon className="h-10 w-10 text-[#8fa0ab] mx-auto mb-3" />
              <h3 className="text-xl">No settlements yet</h3>
              <p className="text-sm text-[#4a5f69] mt-2 max-w-sm mx-auto">
                Authorized payouts appear here after the carrier stamps and settles a file.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
