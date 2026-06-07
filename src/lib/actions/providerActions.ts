"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import { uploadFile } from "@/lib/utils/storage";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/utils/mailer";

export async function providerSubmitClaim(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !(session.user as any).providerId) {
    throw new Error("Unauthorized");
  }

  const patientName = formData.get("patientName") as string;
  const patientEmail = formData.get("patientEmail") as string;
  const claimAmount = parseFloat(formData.get("claimAmount") as string);
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file uploaded");

  await connectDB();

  const documentUrl = await uploadFile(file);

  const claim = await Claim.create({
    organizationId: (session.user as any).organizationId,
    providerId: (session.user as any).providerId,
    patientName,
    patientEmail,
    claimAmount,
    description,
    documentUrl,
    status: "pending"
  });

  // Notify Provider
  await sendEmail({
    to: session.user.email!,
    subject: "Claim Submitted Successfully",
    html: `<p>Your claim for ${patientName} (₹${claimAmount}) has been received and is pending review.</p>`
  });

  revalidatePath("/provider/dashboard");
  return { success: true, claimId: claim._id.toString() };
}

export async function getProviderClaims() {
  const session = await auth();
  if (!session || !session.user || !(session.user as any).providerId) {
    throw new Error("Unauthorized: Provider access required");
  }

  await connectDB();
  const claims = await Claim.find({ 
    providerId: (session.user as any).providerId 
  }).sort({ submissionDate: -1 });

  return JSON.parse(JSON.stringify(claims));
}

export async function getProviderPayouts() {
  const session = await auth();
  if (!session || !session.user || !(session.user as any).providerId) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const claims = await Claim.find({ 
    providerId: (session.user as any).providerId,
    payoutStatus: 'settled'
  }).sort({ settledDate: -1 });

  return JSON.parse(JSON.stringify(claims));
}
