"use client";

import { useState } from "react";
import { initiatePayout } from "@/lib/actions/financeActions";
import { toast } from "react-hot-toast";
import { 
  CurrencyRupeeIcon, 
  CreditCardIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

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
    <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 text-left">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Entity</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Amount</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            <th className="px-8 py-5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {initialClaims.map((claim) => (
            <tr key={claim._id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-8 py-6">
                <div className="font-bold text-gray-900">{claim.patientName}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">ID: #{claim._id.slice(-6)}</div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-1 text-lg font-black text-emerald-600 font-mono">
                  <CurrencyRupeeIcon className="h-5 w-5" />
                  {claim.approvedAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-300 line-through">Claimed: ₹{claim.claimAmount.toLocaleString()}</div>
              </td>
              <td className="px-8 py-6">
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  Ready for Payout
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <button
                  onClick={() => handleSettle(claim._id)}
                  disabled={isProcessing === claim._id}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-200 transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                >
                  {isProcessing === claim._id ? (
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCardIcon className="h-4 w-4" />
                      Settle Funds
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
          {initialClaims.length === 0 && (
            <tr>
              <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic">
                No approved claims currently awaiting settlement.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
