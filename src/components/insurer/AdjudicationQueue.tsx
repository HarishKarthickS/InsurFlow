"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { assignClaim } from "@/lib/actions/adjudicationActions";

const RiskBadge = ({ level }: { level: string }) => {
  const classes: any = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${classes[level] || 'bg-gray-100 text-gray-700'}`}>
      {level} Risk
    </span>
  );
};

export default function AdjudicationQueue({ claims, team = [] }: { claims: any[], team?: any[] }) {
  const [filter, setFilter] = useState("");
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const handleAssign = async (claimId: string, assigneeId: string) => {
    setIsAssigning(claimId);
    try {
      await assignClaim(claimId, assigneeId);
      toast.success("Claim assigned");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Master Claims Queue</h2>
        <div className="relative w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filter by name or ID..." 
            className="input pl-10 text-sm py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assignee</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((claim) => (
                <tr key={claim._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <RiskBadge level={claim.riskLevel || 'low'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{claim.patientName}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: #{claim._id.slice(-6)}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-700 italic">
                    ₹{claim.claimAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="capitalize px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white shadow-sm">
                      {claim.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/10 cursor-pointer hover:bg-white transition-all disabled:opacity-50"
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
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/insurer/claims/${claim._id}`}
                      className="inline-flex items-center text-primary font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:underline"
                    >
                      Process & Adjudicate
                      <ChevronRightIcon className="h-3 w-3 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic font-medium">
            No claims found in the adjudication pool.
          </div>
        )}
      </div>
    </div>
  );
}
