"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClaimStatus } from "@/lib/actions/insurerActions";
import { toast } from "react-hot-toast";

export default function ReviewClaimForm({ claimId, initialAmount }: { claimId: string, initialAmount: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAction = async (formData: FormData) => {
    const action = formData.get("action") as string;
    const amount = parseFloat(formData.get("approvedAmount") as string);
    const comments = formData.get("comments") as string;

    if (!confirm(`Are you sure you want to ${action} this claim?`)) return;

    setIsSubmitting(true);
    try {
      await updateClaimStatus(claimId, action, amount, comments);
      toast.success(`Claim ${action} successfully`);
      router.push("/insurer/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to update claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleAction} className="bg-white p-6 rounded-lg shadow-card space-y-4">
      <h3 className="text-xl font-bold mb-4">Review Claim</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Approved Amount (₹)</label>
        <input 
          name="approvedAmount" 
          type="number" 
          defaultValue={initialAmount}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Insurer Comments</label>
        <textarea 
          name="comments" 
          className="input" 
          rows={3} 
          placeholder="Reason for approval/rejection..."
        ></textarea>
      </div>

      <div className="flex gap-4 pt-2">
        <button 
          name="action" 
          value="approved" 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-success flex-1"
        >
          Approve Claim
        </button>
        <button 
          name="action" 
          value="rejected" 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-danger flex-1"
        >
          Reject Claim
        </button>
      </div>
    </form>
  );
}
