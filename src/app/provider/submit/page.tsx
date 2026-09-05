import ProviderLayout from "@/components/layout/ProviderLayout";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import ProviderClaimForm from "@/components/forms/ProviderClaimForm";

export default function ProviderSubmitPage() {
  return (
    <ProviderLayout>
      <div className="max-w-4xl space-y-5">
        <div>
          <p className="section-kicker">Lodge a file</p>
          <h1 className="text-3xl">Submit claim</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Attach the bill and patient jacket for the carrier queue.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ProviderClaimForm />
          </div>

          <div className="space-y-3">
            <div className="bg-rail text-folder p-5">
              <h3 className="text-lg text-folder mb-3">Intake checklist</h3>
              <ul className="space-y-3 text-sm text-[#c5d4dc]">
                <li className="flex gap-2">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-primary" />
                  Names must match the medical record.
                </li>
                <li className="flex gap-2">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-primary" />
                  Upload a readable PDF or scan of the bill.
                </li>
                <li className="flex gap-2">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-primary" />
                  Desk stamps typically land within 48 hours.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
