"use client";

import { useState } from "react";
import { inviteTeamMember } from "@/lib/actions/teamActions";
import { toast } from "react-hot-toast";
import { 
  UserPlusIcon, 
  XMarkIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function InviteMemberModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await inviteTeamMember(formData);
      if (result.success) {
        toast.success("Team member added successfully");
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
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-widest">Internal Adjudication Staff</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <div className="relative group">
                <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input name="name" type="text" className="input pl-10 py-3" placeholder="John Adjuster" required />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Corporate Email</label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input name="email" type="email" className="input pl-10 py-3" placeholder="john@company.com" required />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Access Role</label>
              <div className="relative group">
                <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <select name="role" className="input pl-10 py-3 appearance-none" required>
                  <option value="adjuster">Adjuster (Standard Review)</option>
                  <option value="manager">Manager (High Risk Review)</option>
                  <option value="admin">Admin (System Controls)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlusIcon className="h-5 w-5" />
                  Invite Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
