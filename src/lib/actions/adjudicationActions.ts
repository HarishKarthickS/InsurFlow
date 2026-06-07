"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import Organization from "@/lib/models/Organization";
import { revalidatePath } from "next/cache";

/**
 * Runs fraud detection rules on a claim
 */
export async function analyzeRisk(claim: any, org: any) {
  const flags = [];
  let riskLevel = 'low';

  // 1. Amount Check
  if (claim.claimAmount > 500000) {
    flags.push("Extremely high claim amount (Critical)");
    riskLevel = 'critical';
  } else if (claim.claimAmount > 100000) {
    flags.push("High claim amount (Manual review required)");
    riskLevel = 'high';
  }

  // 2. Policy Rule Checks
  if (org.policyRules?.length > 0) {
    for (const rule of org.policyRules) {
      if (claim.description.toLowerCase().includes(rule.category.toLowerCase()) && claim.claimAmount > rule.maxAmount) {
        flags.push(`Exceeds ${rule.category} policy limit of ₹${rule.maxAmount}`);
        riskLevel = 'medium';
      }
    }
  }

  return { riskLevel, flags };
}

export async function getQueuedClaims() {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  
  // Only show claims for the user's organization
  const claims = await Claim.find({ 
    organizationId: (session.user as any).organizationId 
  }).sort({ riskLevel: -1, submissionDate: -1 });

  return JSON.parse(JSON.stringify(claims));
}

export async function addInternalNote(claimId: string, note: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  
  await Claim.findByIdAndUpdate(claimId, {
    $push: {
      internalNotes: {
        user: (session.user as any).id,
        note,
        createdAt: new Date()
      }
    }
  });

  revalidatePath(`/insurer/claims/${claimId}`);
  return { success: true };
}

export async function assignClaim(claimId: string, assigneeId: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  await Claim.findByIdAndUpdate(claimId, { assignee: assigneeId });

  revalidatePath("/insurer/dashboard");
  return { success: true };
}
