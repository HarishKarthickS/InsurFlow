"use client";

import { useState } from "react";
import Link from "next/link";
import { updateClaimStatus } from "@/lib/actions/insurerActions";
import { toast } from "react-hot-toast";
import { 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import StatusStamp from "@/components/ui/StatusStamp";

export default function ClaimsTable({ initialClaims }: { initialClaims: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredClaims = initialClaims.filter(claim => {
    const matchesSearch = 
      claim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? claim.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleUpdate = async (id: string, status: string, amount?: number) => {
    if (!confirm(`Are you sure you want to ${status} this claim?`)) return;
    
    setIsUpdating(id);
    try {
      await updateClaimStatus(id, status, amount);
      toast.success(`Claim ${status} successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update claim");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 card p-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa0ab]" />
          <input
            type="text"
            placeholder="Search by patient or file ID"
            className="input pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-44"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All stamps</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="queue-board overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Stamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <tr key={claim._id}>
                <td className="file-id">FILE-{claim._id.slice(-6).toUpperCase()}</td>
                <td>
                  <div className="text-sm font-medium">{claim.name}</div>
                  <div className="text-xs text-[#4a5f69]">{claim.email}</div>
                </td>
                <td className="text-sm text-[#4a5f69]">
                  {new Date(claim.submissionDate).toLocaleDateString()}
                </td>
                <td>
                  <div className="font-mono text-sm tabular-nums">₹{claim.claimAmount.toLocaleString()}</div>
                  {claim.approvedAmount && (
                    <div className="text-xs text-success font-mono">Auth ₹{claim.approvedAmount.toLocaleString()}</div>
                  )}
                </td>
                <td>
                  <StatusStamp status={claim.status} />
                </td>
                <td className="space-x-1">
                  <Link
                    href={`/insurer/claims/${claim._id}`}
                    className="inline-flex p-1.5 text-primary hover:bg-[#dce6eb]"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  {claim.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdate(claim._id, 'approved', claim.claimAmount)}
                        disabled={isUpdating === claim._id}
                        className="inline-flex p-1.5 text-success hover:bg-[#dce8e2] disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdate(claim._id, 'rejected')}
                        disabled={isUpdating === claim._id}
                        className="inline-flex p-1.5 text-danger hover:bg-[#f0e4e4] disabled:opacity-50"
                        title="Reject"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClaims.length === 0 && (
          <div className="text-center py-10 text-[#4a5f69] text-sm">
            No files match this tray filter.
          </div>
        )}
      </div>
    </div>
  );
}
