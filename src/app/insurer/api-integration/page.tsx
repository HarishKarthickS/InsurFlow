import InsurerLayout from "@/components/layout/InsurerLayout";
import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Organization from "@/lib/models/Organization";
import { 
  KeyIcon, 
  CommandLineIcon, 
  DocumentDuplicateIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

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
      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">API & Integrations</h1>
          <p className="text-gray-500 mt-1">Connect your hospitals and clinic networks directly to your adjudication engine.</p>
        </div>

        {/* API Key Card */}
        <div className="card border-primary/20 bg-primary/5">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <KeyIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Your Organization API Key</h3>
                <p className="text-sm text-gray-500 mt-1 italic">Use this key in the `x-api-key` header for all requests.</p>
                <div className="mt-4 flex items-center gap-2">
                  <code className="bg-white border border-primary/20 px-4 py-2 rounded-lg text-primary font-mono font-bold select-all">
                    {org.apiKey || 'No key generated'}
                  </code>
                  <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <span className="flex items-center gap-1 text-success text-xs font-bold uppercase tracking-widest bg-success/10 px-3 py-1 rounded-full border border-success/20">
                <ShieldCheckIcon className="h-3 w-3" />
                Secure
              </span>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CommandLineIcon className="h-6 w-6 text-gray-400" />
            Ingestion Endpoint
          </h2>
          
          <div className="card bg-slate-900 border-none text-slate-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-success text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">POST</span>
              <code className="text-sm font-mono">/api/v1/ingest/claim</code>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Request Headers</p>
                <pre className="text-xs bg-slate-800/50 p-4 rounded-lg">
                  {`{\n  "Content-Type": "application/json",\n  "x-api-key": "${org.apiKey || 'YOUR_KEY'}"\n}`}
                </pre>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Payload (JSON)</p>
                <pre className="text-xs bg-slate-800/50 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(samplePayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InsurerLayout>
  );
}
