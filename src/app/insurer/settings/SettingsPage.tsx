"use client";

import { useState } from "react";
import InsurerLayout from "@/components/layout/InsurerLayout";
import { removePolicyRule } from "@/lib/actions/teamActions";
import WorkspaceSettingsForm from "@/components/forms/WorkspaceSettingsForm";
import AddPolicyModal from "@/components/insurer/AddPolicyModal";
import { 
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
    <InsurerLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <p className="section-kicker">Governance</p>
          <h1 className="text-3xl">Desk rules</h1>
        </div>

        <WorkspaceSettingsForm initialOrg={org} />

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 border-b border-[#c5d0d8] pb-2">
            <h3 className="section-kicker flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              Active rules
            </h3>
            <button 
              onClick={() => setIsPolicyModalOpen(true)}
              className="section-kicker text-primary hover:underline"
            >
              + Add rule
            </button>
          </div>

          <div className="space-y-2">
            {(org.policyRules || []).length === 0 ? (
              <div className="p-8 bg-[#e8eef1] text-center border border-dashed border-[#8fa0ab]">
                <p className="text-sm text-[#4a5f69]">No risk heuristics on this desk.</p>
              </div>
            ) : (
              org.policyRules.map((rule: any, i: number) => (
                <div key={i} className="group p-3 bg-[#e8eef1] border border-[#c5d0d8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckBadgeIcon className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-display uppercase tracking-wide text-sm">{rule.category}</p>
                      <p className="file-id">Threshold ₹{rule.maxAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemovePolicy(rule._id)}
                    className="p-1 text-[#8fa0ab] hover:text-danger opacity-0 group-hover:opacity-100"
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
    </InsurerLayout>
  );
}
