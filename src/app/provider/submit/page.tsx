import ProviderLayout from "@/components/layout/ProviderLayout";
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  UserIcon, 
  CurrencyRupeeIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import ProviderClaimForm from "@/components/forms/ProviderClaimForm";

export default function ProviderSubmitPage() {
  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">SUBMIT NEW CLAIM</h1>
          <p className="text-slate-500 font-medium mt-1">Provide patient evidence and billing information for insurance review.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProviderClaimForm />
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-500 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <h3 className="text-lg font-bold mb-4">Submission Guide</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-200" />
                  <span>Ensure all patient details match official medical records.</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-200" />
                  <span>Upload clear, legible PDF or image copies of bills.</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-200" />
                  <span>Adjudication results typically arrive within 48 hours.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Need Help?</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">If you're having trouble with digital submission, please contact our support desk.</p>
              <button className="text-xs font-bold text-emerald-600 hover:underline">Download Hospital API Guide &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
