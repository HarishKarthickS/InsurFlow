"use client";

import { useState } from "react";
import { initiatePayout } from "@/lib/actions/financeActions";
import { toast } from "react-hot-toast";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import StatusStamp from "@/components/ui/StatusStamp";

export default function PayoutTable({ initialClaims }: { initialClaims: any[] }) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleSettle = async (id: string) => {
    if (!confirm("Authorize financial settlement for this claim?")) return;
    
    setIsProcessing(id);
    try {
      const res = await initiatePayout(id);
      toast.success(`Settlement complete: ${res.reference}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="queue-board overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Authorized</th>
            <th>Stamp</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {initialClaims.map((claim) => (
            <tr key={claim._id}>
              <td>
                <div className="font-medium">{claim.patientName}</div>
                <div className="file-id">FILE-{claim._id.slice(-6).toUpperCase()}</div>
              </td>
              <td>
                <div className="font-mono tabular-nums text-success">
                  ₹{claim.approvedAmount.toLocaleString()}
                </div>
                <div className="file-id line-through">Claimed ₹{claim.claimAmount.toLocaleString()}</div>
              </td>
              <td>
                <StatusStamp status="payout" label="Ready to settle" />
              </td>
              <td className="text-right">
                <button
                  onClick={() => handleSettle(claim._id)}
                  disabled={isProcessing === claim._id}
                  className="btn btn-primary ml-auto disabled:opacity-50"
                >
                  {isProcessing === claim._id ? (
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCardIcon className="h-4 w-4" />
                      Settle
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
          {initialClaims.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-16 text-center text-[#4a5f69] text-sm">
                No approved files awaiting settlement.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
