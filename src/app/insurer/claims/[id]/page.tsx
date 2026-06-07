import InsurerLayout from "@/components/layout/InsurerLayout";
import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  DocumentIcon,
  UserIcon,
  CurrencyRupeeIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import ReviewClaimForm from "@/components/insurer/ReviewClaimForm";
import AuditTimeline from "@/components/insurer/AuditTimeline";
import InternalNotesSection from "@/components/insurer/InternalNotesSection";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-danger/10 text-danger border-danger/20';
      case 'flagged': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusClasses()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

export default async function InsurerClaimDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || (session.user as any).role === "patient") return null;

  await connectDB();
  const claim = await Claim.findById(id).populate('assignee', 'name');

  if (!claim) notFound();

  return (
    <InsurerLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href="/insurer/dashboard" className="inline-flex items-center text-primary font-bold hover:underline">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Command Center
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-card border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reviewing Claim</h1>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">ID: {claim._id.toString()}</p>
          </div>
          <div className="flex gap-3">
            {claim.riskLevel !== 'low' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-danger/5 text-danger border border-danger/20 rounded-xl">
                <ExclamationCircleIcon className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest">{claim.riskLevel} Risk Detected</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: PRIMARY INFO */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Patient Context</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">Legal Name</label>
                    <p className="font-bold text-gray-800">{claim.patientName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">Email Contact</label>
                    <p className="flex items-center gap-2 font-medium text-gray-600">
                      <EnvelopeIcon className="h-4 w-4" /> {claim.patientEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Financial Summary</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">Total Claimed</label>
                    <p className="text-2xl font-black text-gray-900 font-mono italic">₹{claim.claimAmount.toLocaleString()}</p>
                  </div>
                  {claim.approvedAmount && (
                    <div>
                      <label className="text-[10px] font-black text-success uppercase block mb-1">Authorized Amount</label>
                      <p className="text-xl font-black text-success font-mono italic">₹{claim.approvedAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 italic">Adjudication Evidence</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase block mb-2 underline">Description of Services</label>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">{claim.description}</p>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                    <DocumentIcon className="h-5 w-5" />
                    Digitalized Document
                  </div>
                  <a 
                    href={claim.documentUrl} 
                    target="_blank" 
                    className="btn btn-secondary px-6 py-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
                  >
                    View Original File
                  </a>
                </div>
              </div>
            </div>

            {/* Risk Warnings */}
            {claim.riskNotes?.length > 0 && (
              <div className="card border-l-4 border-l-danger bg-danger/5">
                <h3 className="text-xs font-black text-danger uppercase tracking-widest mb-4">Risk Engine Findings</h3>
                <ul className="space-y-3">
                  {claim.riskNotes.map((note: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-danger font-bold italic">
                      <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Audit History */}
            <div className="card">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">System Audit History</h3>
              <AuditTimeline events={claim.auditTrail} />
            </div>
          </div>

          {/* RIGHT COLUMN: COLLABORATION & ACTION */}
          <div className="lg:col-span-4 space-y-8">
            {/* Adjudication Form */}
            {(claim.status === 'pending' || claim.status === 'in_review' || claim.status === 'flagged') && (
              <ReviewClaimForm claimId={claim._id.toString()} initialAmount={claim.claimAmount} />
            )}

            {/* Internal Notes */}
            <div className="card">
              <InternalNotesSection claimId={claim._id.toString()} initialNotes={claim.internalNotes || []} />
            </div>

            {/* Meta Info */}
            <div className="card bg-gray-900 border-none">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Internal Metadata</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Current Assignee</span>
                  <span className="text-white font-bold">{claim.assignee?.name || 'Open Pool'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Digitized On</span>
                  <span className="text-white font-bold">{new Date(claim.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Last Integrity Check</span>
                  <span className="text-success font-black uppercase tracking-tighter">Passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InsurerLayout>
  );
}
