"use server";

import connectDB from "@/lib/utils/db";
import User from "@/lib/models/User";
import Organization from "@/lib/models/Organization";
import crypto from 'crypto';

export async function registerOrganization(formData: FormData) {
  const orgName = formData.get("orgName") as string;
  const orgSlug = formData.get("orgSlug") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await connectDB();

  // 1. Check if user or slug exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const existingOrg = await Organization.findOne({ slug: orgSlug.toLowerCase() });
  if (existingOrg) throw new Error("Organization slug already taken");

  // 2. Create Organization
  const org = await Organization.create({
    name: orgName,
    slug: orgSlug.toLowerCase(),
    apiKey: crypto.randomBytes(32).toString('hex')
  });

  // 3. Create Admin User
  await User.create({
    name,
    email,
    password,
    role: "admin",
    organizationId: org._id
  });

  return { success: true };
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await connectDB();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create user - role defaults to patient for public registration
  const user = await User.create({
    name,
    email,
    password, // Will be hashed by pre-save hook
    role: "patient",
  });

  return { success: true };
}
