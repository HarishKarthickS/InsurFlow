"use client";

import { useState } from "react";
import InsurerLayout from "@/components/layout/InsurerLayout";
import { removePolicyRule } from "@/lib/actions/teamActions";
import WorkspaceSettingsForm from "@/components/forms/WorkspaceSettingsForm";
import AddPolicyModal from "@/components/insurer/AddPolicyModal";
import { 
  SwatchIcon, 
  CheckBadgeIcon,
  XMarkIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function SettingsPage({ org }: { org: any }) {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const handleRemovePolicy = async (id: string) => {
    if (!confirm("Remove this adjudication policy?")) return;
    try {
      await removePolicyRule(id);
      toast.success("Policy removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Workspace Controls</h1>
        <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Enterprise Brand & Governance</p>
      </div>

      <WorkspaceSettingsForm initialOrg={org} />

      {/* Adjudication Policies */}
      <div className="card border-none shadow-xl shadow-slate-200/40 p-10 bg-white rounded-[3rem]">
        <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4" />
            Active Adjudication Rules
          </h3>
          <button 
            onClick={() => setIsPolicyModalOpen(true)}
            className="text-xs font-black text-primary hover:underline italic"
          >
            + ADD NEW RULE
          </button>
        </div>

        <div className="space-y-4">
          {(org.policyRules || []).length === 0 ? (
            <div className="p-12 bg-gray-50 rounded-[2rem] text-center border-2 border-dashed border-gray-100">
              <p className="text-sm text-gray-400 font-bold italic">No active risk heuristics defined.</p>
            </div>
          ) : (
            org.policyRules.map((rule: any, i: number) => (
              <div key={i} className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CheckBadgeIcon className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 uppercase text-sm tracking-tight">{rule.category}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Threshold: ₹{rule.maxAmount.toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemovePolicy(rule._id)}
                  className="p-2 text-gray-300 hover:text-danger hover:bg-danger/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <AddPolicyModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} />
    </div>
  );
}
