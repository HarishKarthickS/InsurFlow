import InsurerLayout from "@/components/layout/InsurerLayout";
import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  DocumentIcon,
  EnvelopeIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import ReviewClaimForm from "@/components/insurer/ReviewClaimForm";
import AuditTimeline from "@/components/insurer/AuditTimeline";
import InternalNotesSection from "@/components/insurer/InternalNotesSection";
import StatusStamp from "@/components/ui/StatusStamp";

export default async function InsurerClaimDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || (session.user as any).role === "patient") return null;

  await connectDB();
  const claim = await Claim.findById(id).populate('assignee', 'name');

  if (!claim) notFound();

  return (
    <InsurerLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        <Link href="/insurer/dashboard" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to queue
        </Link>

        <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Medical file</p>
            <div className="flex items-center gap-4 mt-1">
              <h1 className="text-2xl">Review folder</h1>
              <StatusStamp status={claim.status} />
            </div>
            <p className="file-id mt-2">FILE-{claim._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          {claim.riskLevel !== 'low' && (
            <div className="flex items-center gap-2 px-3 py-2 border border-danger/40 bg-[#f6ecec] text-danger">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span className="section-kicker text-danger">{claim.riskLevel} risk</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4">
                <h3 className="section-kicker mb-3">Patient jacket</h3>
                <div className="space-y-3">
                  <div>
                    <p className="section-kicker">Legal name</p>
                    <p className="font-medium">{claim.patientName}</p>
                  </div>
                  <div>
                    <p className="section-kicker">Contact</p>
                    <p className="flex items-center gap-2 text-sm text-[#4a5f69]">
                      <EnvelopeIcon className="h-4 w-4" /> {claim.patientEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="section-kicker mb-3">Billed figures</h3>
                <div>
                  <p className="section-kicker">Claimed</p>
                  <p className="font-mono text-2xl tabular-nums">₹{claim.claimAmount.toLocaleString()}</p>
                </div>
                {claim.approvedAmount && (
                  <div className="mt-3">
                    <p className="section-kicker text-success">Authorized</p>
                    <p className="font-mono text-xl text-success tabular-nums">₹{claim.approvedAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="section-kicker mb-3">Evidence</h3>
              <p className="text-sm leading-relaxed bg-[#e8eef1] p-4 border border-[#c5d0d8]">{claim.description}</p>
              <div className="mt-4 pt-3 border-t border-[#c5d0d8] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#4a5f69]">
                  <DocumentIcon className="h-5 w-5" />
                  Attached bill
                </div>
                <a href={claim.documentUrl} target="_blank" className="btn btn-secondary text-xs">
                  Open original
                </a>
              </div>
            </div>

            {claim.riskNotes?.length > 0 && (
              <div className="card p-4 border-l-4 border-l-danger">
                <h3 className="section-kicker text-danger mb-3">Risk notes</h3>
                <ul className="space-y-2">
                  {claim.riskNotes.map((note: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-danger">
                      <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card p-4">
              <h3 className="section-kicker mb-5">Audit tape</h3>
              <AuditTimeline events={claim.auditTrail} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            {(claim.status === 'pending' || claim.status === 'in_review' || claim.status === 'flagged') && (
              <ReviewClaimForm claimId={claim._id.toString()} initialAmount={claim.claimAmount} />
            )}

            <div className="card p-4">
              <InternalNotesSection claimId={claim._id.toString()} initialNotes={claim.internalNotes || []} />
            </div>

            <div className="bg-rail text-folder p-4 border border-[#1a2a31]">
              <h3 className="font-display text-[11px] tracking-[0.14em] uppercase text-[#8fa0ab] mb-4">Jacket meta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8fa0ab]">Assignee</span>
                  <span>{claim.assignee?.name || 'Open pool'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8fa0ab]">Digitized</span>
                  <span className="font-mono text-xs">{new Date(claim.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8fa0ab]">Integrity</span>
                  <span className="stamp stamp-approved scale-90">Passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InsurerLayout>
  );
}
