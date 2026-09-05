"use client";

import { useState } from "react";
import InviteMemberModal from "@/components/insurer/InviteMemberModal";
import { 
  EnvelopeIcon, 
  UserPlusIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import StatusStamp from "@/components/ui/StatusStamp";

export default function TeamManager({ initialMembers }: { initialMembers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Floor roster</p>
          <h1 className="text-3xl">Adjusters</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <UserPlusIcon className="h-4 w-4" />
          Add to desk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {initialMembers.map((member: any) => (
          <div key={member._id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 bg-rail text-folder flex items-center justify-center font-display text-lg">
                {member.name?.charAt(0)}
              </div>
              <StatusStamp
                status={member.role === "admin" ? "approved" : member.role === "manager" ? "flagged" : "pending"}
                label={member.role}
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg normal-case tracking-normal">{member.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#4a5f69] mt-1">
                <EnvelopeIcon className="h-3.5 w-3.5" />
                {member.email}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c5d0d8] flex items-center gap-2 section-kicker text-success">
              <ShieldCheckIcon className="h-4 w-4" />
              Authorized
            </div>
          </div>
        ))}
      </div>

      <InviteMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
