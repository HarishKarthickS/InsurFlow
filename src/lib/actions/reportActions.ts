"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/utils/db";
import Claim from "@/lib/models/Claim";

export async function getReportData(filters: any) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  await connectDB();
  
  const query: any = { 
    organizationId: (session.user as any).organizationId 
  };

  if (filters.status) query.status = filters.status;
  if (filters.startDate || filters.endDate) {
    query.submissionDate = {};
    if (filters.startDate) query.submissionDate.$gte = new Date(filters.startDate);
    if (filters.endDate) query.submissionDate.$lte = new Date(filters.endDate);
  }

  const claims = await Claim.find(query).sort({ submissionDate: -1 });

  // Map to CSV format
  const csvData = claims.map(c => ({
    'Claim ID': c._id.toString(),
    'Patient Name': c.patientName,
    'Amount': c.claimAmount,
    'Status': c.status,
    'Risk Level': c.riskLevel,
    'Submission Date': new Date(c.submissionDate).toISOString(),
    'Payout Status': c.payoutStatus || 'unpaid'
  }));

  return JSON.parse(JSON.stringify(csvData));
}
