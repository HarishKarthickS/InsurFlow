"use client";

import { useState } from "react";
import { addPolicyRule } from "@/lib/actions/teamActions";
import { toast } from "react-hot-toast";
import { 
  XMarkIcon,
  CheckBadgeIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

export default function AddPolicyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await addPolicyRule(formData);
      if (result.success) {
        toast.success("Adjudication policy added");
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 italic">NEW ADJUDICATION POLICY</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Rule-Based Governance</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Service Category</label>
              <div className="relative group">
                <CheckBadgeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input name="category" type="text" className="input pl-10 py-4 font-bold" placeholder="e.g. Dental, Surgery, Pharmacy" required />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Threshold Amount (₹)</label>
              <div className="relative group">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input name="maxAmount" type="number" className="input pl-10 py-4 font-black font-mono text-lg" placeholder="0.00" required />
              </div>
              <p className="text-[10px] text-gray-300 mt-2 italic font-bold">Claims exceeding this amount will be flagged for senior review.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Rule Justification</label>
              <textarea name="description" rows={3} className="input py-4 font-medium" placeholder="Explain the context of this limit..." required />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-xs font-black uppercase text-gray-400 hover:text-gray-900 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  ENABLE POLICY
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
