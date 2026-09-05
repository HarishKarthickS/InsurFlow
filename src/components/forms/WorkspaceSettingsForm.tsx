"use client";

import { useState } from "react";
import { updateOrganizationSettings } from "@/lib/actions/teamActions";
import { toast } from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const DEFAULT_PRIMARY = "#1F6A72";
const DEFAULT_SECONDARY = "#5A7A86";

export default function WorkspaceSettingsForm({ initialOrg }: { initialOrg: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateOrganizationSettings(formData);
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card p-5">
        <h3 className="section-kicker mb-4 border-b border-[#c5d0d8] pb-2">Carrier identity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="section-kicker block mb-1">Legal name</label>
            <input name="orgName" type="text" className="input" defaultValue={initialOrg.name} required />
          </div>
          <div>
            <label className="section-kicker block mb-1">Logo URL</label>
            <input name="logoUrl" type="url" className="input" placeholder="https://..." defaultValue={initialOrg.branding?.logoUrl} />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="section-kicker mb-4 border-b border-[#c5d0d8] pb-2">Ink colors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="section-kicker block mb-1">Primary (teal)</label>
            <div className="flex items-center gap-3 bg-[#e8eef1] p-3 border border-[#c5d0d8]">
              <input 
                name="primaryColor"
                type="color" 
                defaultValue={initialOrg.branding?.primaryColor || DEFAULT_PRIMARY} 
                className="w-12 h-12 cursor-pointer border border-[#8fa0ab]"
              />
              <code className="file-id">{initialOrg.branding?.primaryColor || DEFAULT_PRIMARY}</code>
            </div>
          </div>
          <div>
            <label className="section-kicker block mb-1">Secondary (steel)</label>
            <div className="flex items-center gap-3 bg-[#e8eef1] p-3 border border-[#c5d0d8]">
              <input 
                name="secondaryColor"
                type="color" 
                defaultValue={initialOrg.branding?.secondaryColor || DEFAULT_SECONDARY} 
                className="w-12 h-12 cursor-pointer border border-[#8fa0ab]"
              />
              <code className="file-id">{initialOrg.branding?.secondaryColor || DEFAULT_SECONDARY}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : "Save desk settings"}
        </button>
      </div>
    </form>
  );
}
