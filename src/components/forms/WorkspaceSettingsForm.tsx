"use client";

import { useState } from "react";
import { updateOrganizationSettings } from "@/lib/actions/teamActions";
import { toast } from "react-hot-toast";
import { 
  SwatchIcon, 
  GlobeAltIcon, 
  PhotoIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

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
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="card border-none shadow-xl shadow-slate-200/40 p-10 bg-white rounded-[3rem]">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10 border-b border-gray-50 pb-4">Corporate Identity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Legal Entity Name</label>
            <div className="relative group">
              <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary" />
              <input name="orgName" type="text" className="input pl-10 py-3 font-bold" defaultValue={initialOrg.name} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Global Logo Asset (URL)</label>
            <div className="relative group">
              <PhotoIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary" />
              <input name="logoUrl" type="url" className="input pl-10 py-3 font-bold" placeholder="https://..." defaultValue={initialOrg.branding?.logoUrl} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-none shadow-xl shadow-slate-200/40 p-10 bg-white rounded-[3rem]">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10 border-b border-gray-50 pb-4">UI Branding & Palette</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Primary Signature Color</label>
            <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <input 
                name="primaryColor"
                type="color" 
                defaultValue={initialOrg.branding?.primaryColor || '#4B56D2'} 
                className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white shadow-sm appearance-none bg-transparent"
              />
              <div>
                <p className="text-sm font-black text-gray-800 tracking-tighter italic">MASTER HUE</p>
                <code className="text-xs font-bold text-gray-400 uppercase">{initialOrg.branding?.primaryColor || '#4B56D2'}</code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Secondary Accent Hue</label>
            <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <input 
                name="secondaryColor"
                type="color" 
                defaultValue={initialOrg.branding?.secondaryColor || '#82C3EC'} 
                className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white shadow-sm appearance-none bg-transparent"
              />
              <div>
                <p className="text-sm font-black text-gray-800 tracking-tighter italic">ACCENT HUE</p>
                <code className="text-xs font-bold text-gray-400 uppercase">{initialOrg.branding?.secondaryColor || '#82C3EC'}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary px-12 py-5 rounded-3xl text-lg font-black italic shadow-2xl shadow-primary/30 flex items-center gap-3 transform hover:scale-105 transition-all"
        >
          {isSubmitting ? (
            <ArrowPathIcon className="h-6 w-6 animate-spin" />
          ) : (
            <>
              COMMIT WORKSPACE CHANGES
            </>
          )}
        </button>
      </div>
    </form>
  );
}
