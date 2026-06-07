"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { providerSubmitClaim } from "@/lib/actions/providerActions";
import { toast } from "react-hot-toast";
import { 
  UserIcon, 
  EnvelopeIcon, 
  CurrencyRupeeIcon, 
  DocumentTextIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";

export default function ProviderClaimForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload supporting evidence");

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await providerSubmitClaim(formData);
      if (result.success) {
        toast.success("Claim submitted to insurance pool");
        router.push("/provider/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Patient Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Patient Full Name</label>
            <div className="relative group">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input name="patientName" type="text" className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/10" placeholder="John Doe" required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contact Email</label>
            <div className="relative group">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input name="patientEmail" type="email" className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/10" placeholder="john@example.com" required />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Medical & Billing Data</h3>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Total Amount Billed (₹)</label>
            <div className="relative group">
              <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input name="claimAmount" type="number" className="w-full bg-slate-50 border-none rounded-xl py-4 pl-10 pr-4 text-lg font-black text-slate-700 focus:ring-2 focus:ring-emerald-500/10 font-mono" placeholder="0.00" required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Treatment Description</label>
            <textarea name="description" rows={4} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/10 resize-none" placeholder="Provide a summary of the medical services..." required />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">File Evidence</h3>
        <div 
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-500/50 bg-slate-50/50'}`}
        >
          <input 
            type="file" 
            id="file-upload-provider" 
            name="file" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file-upload-provider" className="cursor-pointer flex flex-col items-center text-center">
            <CloudArrowUpIcon className={`h-10 w-10 mb-2 ${file ? 'text-emerald-500' : 'text-slate-300'}`} />
            <p className="text-sm font-bold text-slate-700">{file ? file.name : 'Upload Medical Bill'}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PDF or Image (Max 10MB)</p>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transform hover:scale-[1.01] active:scale-95 transition-all duration-200"
      >
        {isSubmitting ? (
          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <DocumentTextIcon className="h-6 w-6" />
            SUBMIT DIGITAL CLAIM
          </>
        )}
      </button>
    </form>
  );
}
