"use client";

import { useState } from "react";
import { addPolicyRule } from "@/lib/actions/teamActions";
import { toast } from "react-hot-toast";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b2c33]/70">
      <div className="bg-folder w-full max-w-lg border border-[#8fa0ab] shadow-[4px_4px_0_#8fa0ab]">
        <div className="p-5 border-b border-[#c5d0d8] flex items-center justify-between">
          <div>
            <h2 className="text-xl">New desk rule</h2>
            <p className="section-kicker mt-0.5">Flag files over threshold</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#e8eef1]">
            <XMarkIcon className="h-5 w-5 text-[#4a5f69]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="section-kicker block mb-1">Service category</label>
            <input name="category" type="text" className="input" placeholder="Dental, Surgery…" required />
          </div>
          <div>
            <label className="section-kicker block mb-1">Threshold (₹)</label>
            <input name="maxAmount" type="number" className="input font-mono" required />
          </div>
          <div>
            <label className="section-kicker block mb-1">Justification</label>
            <textarea name="description" rows={3} className="input" required />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Discard
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
              <PlusIcon className="h-4 w-4" />
              Enable rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
