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

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusClasses()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or ID..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{claim._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{claim.name}</div>
                    <div className="text-xs text-gray-500">{claim.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.submissionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₹{claim.claimAmount.toLocaleString()}</div>
                    {claim.approvedAmount && (
                      <div className="text-xs text-success font-medium">Approved: ₹{claim.approvedAmount.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={claim.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/insurer/claims/${claim._id}`}
                      className="inline-flex items-center p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    {claim.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdate(claim._id, 'approved', claim.claimAmount)}
                          disabled={isUpdating === claim._id}
                          className="inline-flex items-center p-2 text-success hover:bg-success/10 rounded-full transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUpdate(claim._id, 'rejected')}
                          disabled={isUpdating === claim._id}
                          className="inline-flex items-center p-2 text-danger hover:bg-danger/10 rounded-full transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClaims.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No claims found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
