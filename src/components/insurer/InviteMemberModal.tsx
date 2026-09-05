"use client";

import { useState } from "react";
import { inviteTeamMember } from "@/lib/actions/teamActions";
import { toast } from "react-hot-toast";
import { 
  UserPlusIcon, 
  XMarkIcon
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b2c33]/70">
      <div className="bg-folder w-full max-w-lg border border-[#8fa0ab] shadow-[4px_4px_0_#8fa0ab]">
        <div className="p-5 border-b border-[#c5d0d8] flex items-center justify-between">
          <div>
            <h2 className="text-xl">Add adjuster</h2>
            <p className="section-kicker mt-0.5">Internal desk staff</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#e8eef1]">
            <XMarkIcon className="h-5 w-5 text-[#4a5f69]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="section-kicker block mb-1">Full name</label>
            <input name="name" type="text" className="input" required />
          </div>
          <div>
            <label className="section-kicker block mb-1">Work email</label>
            <input name="email" type="email" className="input" required />
          </div>
          <div>
            <label className="section-kicker block mb-1">Role</label>
            <select name="role" className="input" required>
              <option value="adjuster">Adjuster</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
              <UserPlusIcon className="h-4 w-4" />
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
