const TONE: Record<string, string> = {
  approved: "stamp-approved",
  rejected: "stamp-rejected",
  pending: "stamp-pending",
  in_review: "stamp-in_review",
  flagged: "stamp-flagged",
  settled: "stamp-approved",
  payout: "stamp-payout",
};

export default function StatusStamp({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const key = (status || "pending").toLowerCase().replace(" ", "_");
  const tone = TONE[key] || "stamp-pending";
  const text = label || status.replace(/_/g, " ");

  return <span className={`stamp ${tone}`}>{text}</span>;
}
