"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { providerSubmitClaim } from "@/lib/actions/providerActions";
import { toast } from "react-hot-toast";
import { CloudArrowUpIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="card p-4 space-y-3">
        <h3 className="section-kicker border-b border-[#c5d0d8] pb-2">Patient jacket</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="section-kicker block mb-1">Full name</label>
            <input name="patientName" type="text" className="input" required />
          </div>
          <div>
            <label className="section-kicker block mb-1">Email</label>
            <input name="patientEmail" type="email" className="input" required />
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="section-kicker border-b border-[#c5d0d8] pb-2">Billing</h3>
        <div>
          <label className="section-kicker block mb-1">Amount billed (₹)</label>
          <input name="claimAmount" type="number" className="input font-mono text-lg" required />
        </div>
        <div>
          <label className="section-kicker block mb-1">Treatment notes</label>
          <textarea name="description" rows={4} className="input resize-none" required />
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="section-kicker border-b border-[#c5d0d8] pb-2">Evidence</h3>
        <div 
          className={`h-40 border border-dashed flex flex-col items-center justify-center p-4 ${file ? 'border-primary bg-[#dce8e8]' : 'border-[#8fa0ab] bg-[#e8eef1]'}`}
        >
          <input 
            type="file" 
            id="file-upload-provider" 
            name="file" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file-upload-provider" className="cursor-pointer flex flex-col items-center text-center">
            <CloudArrowUpIcon className={`h-8 w-8 mb-2 ${file ? 'text-primary' : 'text-[#8fa0ab]'}`} />
            <p className="text-sm">{file ? file.name : 'Upload medical bill'}</p>
            <p className="file-id mt-1">PDF or image · 10MB</p>
          </label>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-2.5">
        <DocumentTextIcon className="h-5 w-5" />
        {isSubmitting ? "Lodging…" : "Lodge file"}
      </button>
    </form>
  );
}
