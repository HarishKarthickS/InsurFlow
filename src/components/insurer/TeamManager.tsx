"use client";

import { useState } from "react";
import InviteMemberModal from "@/components/insurer/InviteMemberModal";
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  UserPlusIcon,
  ShieldExclamationIcon,
  FingerPrintIcon
} from "@heroicons/react/24/outline";

export default function TeamManager({ initialMembers }: { initialMembers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">TEAM ADJUDICATION</h1>
          <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Global Workforce Registry</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary inline-flex items-center gap-3 px-8 shadow-xl shadow-primary/20 transform hover:scale-105 transition-all"
        >
          <UserPlusIcon className="h-5 w-5" />
          Provision Adjuster
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialMembers.map((member: any) => (
          <div key={member._id} className="card group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-none shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] bg-white p-8 rounded-[2.5rem]">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 transition-colors">
                <FingerPrintIcon className="h-8 w-8 text-gray-200 group-hover:text-primary transition-colors" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                member.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                member.role === 'manager' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                'bg-slate-50 text-slate-700 border-slate-100'
              }`}>
                {member.role}
              </span>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-black text-gray-900 italic tracking-tight">{member.name}</h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                <EnvelopeIcon className="h-3.5 w-3.5" />
                {member.email}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-success uppercase tracking-widest">
                <ShieldCheckIcon className="h-4 w-4" />
                Authorized
              </div>
              <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest hover:underline">
                View Logs
              </button>
            </div>
          </div>
        ))}
      </div>

      <InviteMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
