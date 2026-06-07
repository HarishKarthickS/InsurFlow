"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";
import { uploadFile } from "@/lib/utils/storage";
import { revalidatePath } from "next/cache";
import Organization from "@/lib/models/Organization";
import { analyzeRisk } from "./adjudicationActions";

export async function submitClaim(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const claimAmount = parseFloat(formData.get("claimAmount") as string);
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  await connectDB();

  // Upload using the unified utility
  const documentUrl = await uploadFile(file);

  // Create claim in MongoDB
  const claim = await Claim.create({
    patient: (session.user as any).id,
    organizationId: (session.user as any).organizationId,
    name,
    email,
    claimAmount,
    description,
    documentUrl,
    status: "pending",
  });

  revalidatePath("/patient/dashboard");
  return { success: true, claimId: claim._id.toString() };
}

export async function createManualClaim(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role === 'patient') {
    throw new Error("Not authorized");
  }

  const patientName = formData.get("patientName") as string;
  const patientEmail = formData.get("patientEmail") as string;
  const claimAmount = parseFloat(formData.get("claimAmount") as string);
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file uploaded");

  await connectDB();

  // Upload document
  const documentUrl = await uploadFile(file);

  // Fetch Org for risk rules
  const org = await Organization.findById((session.user as any).organizationId);
  const { riskLevel, flags } = await analyzeRisk({ claimAmount, description }, org);

  // Create claim
  const claim = await Claim.create({
    organizationId: (session.user as any).organizationId,
    assignee: (session.user as any).id, // Auto-assign to the creator for now
    patientName,
    patientEmail,
    claimAmount,
    description,
    documentUrl,
    status: riskLevel === 'critical' ? 'flagged' : 'in_review',
    riskLevel,
    riskNotes: flags
  });

  revalidatePath("/insurer/dashboard");
  return { success: true, claimId: claim._id.toString() };
}

export async function getPatientClaims() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  await connectDB();
  const claims = await Claim.find({ patient: (session.user as any).id }).sort({ submissionDate: -1 });
  
  return JSON.parse(JSON.stringify(claims));
}
