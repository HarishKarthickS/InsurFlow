"use client";

import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { assignClaim } from "@/lib/actions/adjudicationActions";
import StatusStamp from "@/components/ui/StatusStamp";

const RiskStamp = ({ level }: { level: string }) => {
  const tone =
    level === "critical" || level === "high"
      ? "stamp-rejected"
      : level === "medium"
        ? "stamp-flagged"
        : "stamp-approved";

  return <span className={`stamp ${tone}`}>{level} risk</span>;
};

export default function AdjudicationQueue({ claims, team = [] }: { claims: any[], team?: any[] }) {
  const [filter, setFilter] = useState("");
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const handleAssign = async (claimId: string, assigneeId: string) => {
    setIsAssigning(claimId);
    try {
      await assignClaim(claimId, assigneeId);
      toast.success("File assigned");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAssigning(null);
    }
  };

  const filtered = claims.filter(c => 
    c.patientName.toLowerCase().includes(filter.toLowerCase()) ||
    c._id.includes(filter)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Master tray</p>
          <h2 className="text-xl">Folder queue</h2>
        </div>
        <div className="relative w-64">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa0ab]" />
          <input 
            type="text" 
            placeholder="Name or file ID" 
            className="input pl-8 py-1.5 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="queue-board overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Patient file</th>
              <th>Amount</th>
              <th>Stamp</th>
              <th>Assignee</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((claim) => (
              <tr key={claim._id}>
                <td>
                  <RiskStamp level={claim.riskLevel || 'low'} />
                </td>
                <td>
                  <div className="font-medium text-foreground">{claim.patientName}</div>
                  <div className="file-id">FILE-{claim._id.slice(-6).toUpperCase()}</div>
                </td>
                <td className="font-mono tabular-nums text-sm">
                  ₹{claim.claimAmount.toLocaleString()}
                </td>
                <td>
                  <StatusStamp status={claim.status} />
                </td>
                <td>
                  <select
                    className="input py-1 text-xs w-full max-w-[11rem]"
                    defaultValue={claim.assignee || ""}
                    disabled={isAssigning === claim._id}
                    onChange={(e) => handleAssign(claim._id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {team.map((member: any) => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                </td>
                <td className="text-right">
                  <Link 
                    href={`/insurer/claims/${claim._id}`}
                    className="section-kicker text-primary hover:underline"
                  >
                    Open file
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-14 text-[#4a5f69] text-sm">
            Tray empty — no matching files.
          </div>
        )}
      </div>
    </div>
  );
}
