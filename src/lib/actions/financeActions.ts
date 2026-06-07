"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import { revalidatePath } from "next/cache";

export async function getApprovedClaimsForPayout() {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  const claims = await Claim.find({
    organizationId: (session.user as any).organizationId,
    status: 'approved',
    payoutStatus: { $ne: 'settled' }
  }).sort({ lastUpdated: -1 });

  return JSON.parse(JSON.stringify(claims));
}

export async function initiatePayout(claimId: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();

  // Mocking bank API call
  const payoutRef = `SETTLE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  await Claim.findByIdAndUpdate(claimId, {
    payoutStatus: 'settled',
    payoutReference: payoutRef,
    settledDate: new Date(),
    $push: {
      auditTrail: {
        action: 'Financial Settlement',
        toStatus: 'approved',
        user: (session.user as any).id,
        note: `Payout initiated. Reference: ${payoutRef}`,
        timestamp: new Date()
      }
    }
  });

  revalidatePath("/insurer/payouts");
  revalidatePath("/provider/dashboard");
  return { success: true, reference: payoutRef };
}
