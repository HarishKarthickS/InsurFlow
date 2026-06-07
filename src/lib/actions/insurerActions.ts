"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import { revalidatePath } from "next/cache";

import { sendEmail } from "@/lib/utils/mailer";

export async function getAllClaims() {
  const session = await auth();
  if (!session || (session.user as any).role === "patient") {
    throw new Error("Not authorized");
  }

  await connectDB();
  // Multi-tenant filter
  const claims = await Claim.find({ 
    organizationId: (session.user as any).organizationId 
  }).sort({ submissionDate: -1 });
  
  return JSON.parse(JSON.stringify(claims));
}

export async function updateClaimStatus(claimId: string, status: string, approvedAmount?: number, comments?: string) {
  const session = await auth();
  if (!session || (session.user as any).role === "patient") {
    throw new Error("Not authorized");
  }

  await connectDB();
  
  // 1. Get original claim for audit and email info
  const originalClaim = await Claim.findById(claimId);
  if (!originalClaim) throw new Error("Claim not found");

  const updateData: any = { 
    status,
    lastUpdated: new Date()
  };
  
  if (approvedAmount !== undefined) updateData.approvedAmount = approvedAmount;
  if (comments !== undefined) updateData.insurerComments = comments;

  // 2. Add to Audit Trail
  updateData.$push = {
    auditTrail: {
      action: 'Status Update',
      fromStatus: originalClaim.status,
      toStatus: status,
      user: (session.user as any).id,
      note: comments || `Status changed to ${status}`,
      timestamp: new Date()
    }
  };

  const claim = await Claim.findByIdAndUpdate(claimId, updateData, { new: true });

  // 3. Send Notification
  try {
    await sendEmail({
      to: originalClaim.patientEmail,
      subject: `Claim Update: ${status.toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4B56D2;">Aarogya Claims Update</h2>
          <p>Your claim <strong>#${claimId.slice(-8)}</strong> has been updated to: <span style="font-weight: bold; text-transform: uppercase;">${status}</span></p>
          ${approvedAmount ? `<p>Approved Amount: <strong>₹${approvedAmount.toLocaleString()}</strong></p>` : ''}
          ${comments ? `<p>Comments: <em>"${comments}"</em></p>` : ''}
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification from your insurance provider.</p>
        </div>
      `
    });
  } catch (err) {
    console.error("Notification failed", err);
  }

  revalidatePath("/insurer/dashboard");
  revalidatePath(`/insurer/claims/${claimId}`);
  
  return { success: true, claim: JSON.parse(JSON.stringify(claim)) };
}
