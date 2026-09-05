"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createManualClaim } from "@/lib/actions/claimActions";
import { toast } from "react-hot-toast";
import { 
  CloudArrowUpIcon,
  DocumentTextIcon,
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
      setIsExtracting(true);
      toast.loading("Extracting fields from bill…", { id: "ocr" });
      
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
            toast.success("Fields pulled from bill", { id: "ocr" });
          }
        };
      } catch (err) {
        toast.error("Extraction failed", { id: "ocr" });
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
        toast.success("File digitized");
        router.push("/insurer/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-5">
        <p className="section-kicker">Paper intake</p>
        <h1 className="text-3xl">Digitize a bill</h1>
        <p className="text-sm text-[#4a5f69] mt-1">Drop a medical bill, confirm the jacket, file it to the queue.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="section-kicker mb-3">1. Evidence</h3>
            <div 
              className={`relative h-56 border border-dashed flex flex-col items-center justify-center p-6 ${file ? 'border-primary bg-[#dce8e8]' : 'border-[#8fa0ab] bg-[#e8eef1]'}`}
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
                    <ArrowPathIcon className="h-10 w-10 mb-3 text-primary animate-spin" />
                    <p className="text-sm text-primary">Reading bill…</p>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className={`h-10 w-10 mb-3 ${file ? 'text-primary' : 'text-[#8fa0ab]'}`} />
                    <p className="text-sm">{file ? file.name : 'Drop medical bill PDF'}</p>
                    <p className="file-id mt-2">PDF, JPG, PNG · 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="section-kicker mb-3">2. Patient jacket</h3>
            <div className="space-y-3">
              <div>
                <label className="section-kicker block mb-1">Legal name</label>
                <input name="patientName" type="text" className="input" required />
              </div>
              <div>
                <label className="section-kicker block mb-1">Notify email</label>
                <input name="patientEmail" type="email" className="input" required />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-4 flex flex-col">
          <h3 className="section-kicker mb-3">3. Verification</h3>
          <div className="space-y-3 flex-1">
            <div>
              <label className="section-kicker block mb-1">Billed (₹)</label>
              <input name="claimAmount" type="number" className="input font-mono text-lg" required />
            </div>
            <div>
              <label className="section-kicker block mb-1">Service notes</label>
              <textarea name="description" rows={8} className="input leading-relaxed" required />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || isExtracting}
            className="btn btn-primary w-full mt-4 py-2.5"
          >
            <DocumentTextIcon className="h-5 w-5" />
            {isSubmitting ? "Filing…" : "File to queue"}
          </button>
        </div>
      </form>
    </div>
  );
}
