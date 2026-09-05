import InsurerLayout from "@/components/layout/InsurerLayout";
import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Organization from "@/lib/models/Organization";
import { 
  KeyIcon, 
  CommandLineIcon
} from "@heroicons/react/24/outline";
import StatusStamp from "@/components/ui/StatusStamp";

export default async function ApiIntegrationPage() {
  const session = await auth();
  if (!session) return null;

  await connectDB();
  const org = await Organization.findById((session.user as any).organizationId);

  const samplePayload = {
    patientName: "John Doe",
    patientEmail: "john@example.com",
    claimAmount: 25000,
    description: "Emergency Appendectomy",
    documentBase64: "...",
    fileName: "bill_001.pdf"
  };

  return (
    <InsurerLayout>
      <div className="space-y-5 max-w-5xl">
        <div>
          <p className="section-kicker">Hospital ingest</p>
          <h1 className="text-3xl">API tray</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Push facility bills straight into the adjudication queue.</p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-rail text-folder flex items-center justify-center shrink-0">
                <KeyIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg">Organization key</h3>
                <p className="text-sm text-[#4a5f69] mt-1">Send as <span className="font-mono">x-api-key</span>.</p>
                <code className="mt-3 inline-block bg-[#e8eef1] border border-[#8fa0ab] px-3 py-1.5 font-mono text-xs select-all">
                  {org.apiKey || 'No key generated'}
                </code>
              </div>
            </div>
            <StatusStamp status="approved" label="Secure" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl flex items-center gap-2">
            <CommandLineIcon className="h-5 w-5" />
            Ingestion
          </h2>
          
          <div className="bg-rail text-[#c5d4dc] p-5 font-mono text-xs">
            <div className="flex items-center gap-2 mb-4 font-sans">
              <span className="stamp stamp-approved">POST</span>
              <code>/api/v1/ingest/claim</code>
            </div>
            
            <p className="section-kicker text-[#8fa0ab] mb-2">Headers</p>
            <pre className="bg-[#1a2a31] p-3 overflow-x-auto">
{`{
  "Content-Type": "application/json",
  "x-api-key": "${org.apiKey || 'YOUR_KEY'}"
}`}
            </pre>

            <p className="section-kicker text-[#8fa0ab] mt-4 mb-2">Payload</p>
            <pre className="bg-[#1a2a31] p-3 overflow-x-auto">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </InsurerLayout>
  );
}
