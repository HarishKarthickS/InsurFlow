import ProviderLayout from "@/components/layout/ProviderLayout";
import { getProviderPayouts } from "@/lib/actions/providerActions";
import { 
  CreditCardIcon, 
  CheckBadgeIcon, 
  CalendarDaysIcon,
  DocumentMagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default async function ProviderPayoutsPage() {
  const payouts = await getProviderPayouts();

  return (
    <ProviderLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Settlement History</h1>
          <p className="text-slate-500 font-medium">Verify your authorized payouts and financial references.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {payouts.map((p: any) => (
            <div key={p._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-emerald-200 transition-all">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 transition-colors">
                  <CheckBadgeIcon className="h-8 w-8 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 italic">₹{p.approvedAmount.toLocaleString()}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Authorized Settlement</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <CalendarDaysIcon className="h-4 w-4" />
                      {new Date(p.settledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <CreditCardIcon className="h-3.5 w-3.5" />
                      {p.payoutReference}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Linked Claim</p>
                  <p className="text-xs font-bold text-slate-500">#{p._id.slice(-10)}</p>
                </div>
                <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
                  <DocumentMagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}

          {payouts.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCardIcon className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No settlements processed</h3>
              <p className="text-slate-400 mt-2 max-w-xs mx-auto">Your authorized payouts will appear here once the insurance provider settles your approved claims.</p>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
