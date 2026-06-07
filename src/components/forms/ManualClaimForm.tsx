"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createManualClaim } from "@/lib/actions/claimActions";
import { toast } from "react-hot-toast";
import { 
  UserIcon, 
  EnvelopeIcon, 
  CurrencyRupeeIcon, 
  DocumentTextIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function ManualClaimForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      // Trigger AI Extraction
      setIsExtracting(true);
      toast.loading("AI: Extracting data from document...", { id: "ocr" });
      
      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const res = await fetch('/api/v1/extract', {
            method: 'POST',
            body: JSON.stringify({ 
              documentBase64: base64,
              mimeType: selectedFile.type 
            })
          });
          const result = await res.json();
          
          if (result.success && formRef.current) {
            const { data } = result;
            formRef.current.patientName.value = data.patientName;
            formRef.current.patientEmail.value = data.patientEmail;
            formRef.current.claimAmount.value = data.claimAmount;
            formRef.current.description.value = data.description;
            toast.success("AI: Data extracted successfully", { id: "ocr" });
          }
        };
      } catch (err) {
        toast.error("AI: Extraction failed", { id: "ocr" });
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a document");

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createManualClaim(formData);
      if (result.success) {
        toast.success("Claim digitized successfully");
        router.push("/insurer/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">MANUAL DIGITIZATION</h1>
        <p className="text-gray-500 mt-2 font-medium">Use AI-powered OCR to instantly convert medical bills into digital claims.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">1. Upload Evidence</h3>
            <div 
              className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-all ${file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-gray-50/50'}`}
            >
              <input 
                type="file" 
                id="file-upload" 
                name="file" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-center">
                {isExtracting ? (
                  <>
                    <ArrowPathIcon className="h-12 w-12 mb-4 text-primary animate-spin" />
                    <p className="font-bold text-primary italic">AI ENGINE WORKING...</p>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className={`h-12 w-12 mb-4 ${file ? 'text-primary' : 'text-gray-300'}`} />
                    <p className="font-bold text-gray-700">{file ? file.name : 'Drop Medical Bill PDF'}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest italic">Supports PDF, JPG, PNG up to 10MB</p>
                  </>
                )}
              </label>
              
              {file && !isExtracting && (
                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-[10px] font-black text-primary border border-primary/20 shadow-sm animate-pulse">
                    <SparklesIcon className="h-3 w-3" />
                    AI PROCESSED
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">2. Patient Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Legal Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input name="patientName" type="text" className="input pl-10" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Email for Notifications</label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input name="patientEmail" type="email" className="input pl-10" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card h-full flex flex-col">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">3. Claim Verification</h3>
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Billed Amount (₹)</label>
                <div className="relative group">
                  <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input name="claimAmount" type="number" className="input pl-10 text-xl font-black font-mono" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Service Description</label>
                <textarea name="description" rows={6} className="input leading-relaxed" required />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50">
              <button
                type="submit"
                disabled={isSubmitting || isExtracting}
                className="btn btn-primary w-full py-4 text-lg font-black italic shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <DocumentTextIcon className="h-6 w-6" />
                    FINALIZE & ADJUDICATE
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
