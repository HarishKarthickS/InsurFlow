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
    <form action={handleAction} className="card p-4 space-y-3">
      <h3 className="text-lg">Stamp decision</h3>
      
      <div>
        <label className="section-kicker block mb-1">Authorized amount (₹)</label>
        <input 
          name="approvedAmount" 
          type="number" 
          defaultValue={initialAmount}
          className="input font-mono"
          required
        />
      </div>

      <div>
        <label className="section-kicker block mb-1">Adjuster remarks</label>
        <textarea 
          name="comments" 
          className="input" 
          rows={3} 
          placeholder="Reason for approval or rejection"
        ></textarea>
      </div>

      <div className="flex gap-2 pt-1">
        <button 
          name="action" 
          value="approved" 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-success flex-1"
        >
          Approve
        </button>
        <button 
          name="action" 
          value="rejected" 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-danger flex-1"
        >
          Reject
        </button>
      </div>
    </form>
  );
}
