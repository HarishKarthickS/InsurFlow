"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import User from "@/lib/models/User";
import Organization from "@/lib/models/Organization";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  const members = await User.find({ 
    organizationId: (session.user as any).organizationId 
  }).select("-password").sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(members));
}

export async function inviteTeamMember(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== 'admin') {
    throw new Error("Unauthorized: Only admins can invite members");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  await connectDB();

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User with this email already exists");

  // Create new user (B2B members default to 'password' for demo, in production we'd send invite email)
  await User.create({
    name,
    email,
    password: 'password', // Initial password
    role,
    organizationId: (session.user as any).organizationId
  });

  revalidatePath("/insurer/team");
  return { success: true };
}

export async function getOrganizationSettings() {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  const org = await Organization.findById((session.user as any).organizationId);
  
  return JSON.parse(JSON.stringify(org));
}

export async function updateOrganizationSettings(formData: FormData) {
  // ... (existing logic)
}

export async function addPolicyRule(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== 'admin') {
    throw new Error("Unauthorized");
  }

  const category = formData.get("category") as string;
  const maxAmount = parseFloat(formData.get("maxAmount") as string);
  const description = formData.get("description") as string;

  await connectDB();
  await Organization.findByIdAndUpdate((session.user as any).organizationId, {
    $push: {
      policyRules: { category, maxAmount, description }
    }
  });

  revalidatePath("/insurer/settings");
  return { success: true };
}

export async function removePolicyRule(ruleId: string) {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== 'admin') {
    throw new Error("Unauthorized");
  }

  await connectDB();
  await Organization.findByIdAndUpdate((session.user as any).organizationId, {
    $pull: {
      policyRules: { _id: ruleId }
    }
  });

  revalidatePath("/insurer/settings");
  return { success: true };
}
