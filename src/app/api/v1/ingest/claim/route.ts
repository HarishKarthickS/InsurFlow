import { NextResponse } from "next/server";
import connectDB from "@/lib/utils/db";
import Organization from "@/lib/models/Organization";
import Claim from "@/lib/models/Claim";
import { uploadFile } from "@/lib/utils/storage";
import { analyzeRisk } from "@/lib/actions/adjudicationActions";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    await connectDB();

    // Validate Tenant
    const org = await Organization.findOne({ apiKey });
    if (!org) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    const body = await request.json();
    const { patientName, patientEmail, claimAmount, description, documentBase64, fileName } = body;

    // Validate Payload
    if (!patientName || !patientEmail || !claimAmount || !documentBase64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert Base64 to File-like object for upload utility
    const buffer = Buffer.from(documentBase64, 'base64');
    const file = new File([buffer], fileName || 'claim-doc.pdf', { type: 'application/pdf' });

    const documentUrl = await uploadFile(file);

    // Initial risk analysis
    const { riskLevel, flags } = await analyzeRisk({ claimAmount, description }, org);

    // Create Claim
    const claim = await Claim.create({
      organizationId: org._id,
      patientName,
      patientEmail,
      claimAmount,
      description,
      documentUrl,
      status: riskLevel === 'critical' ? 'flagged' : 'pending',
      riskLevel,
      riskNotes: flags
    });

    return NextResponse.json({
      success: true,
      claimId: claim._id,
      message: "Claim ingested successfully"
    }, { status: 201 });

  } catch (error: any) {
    console.error("API Ingestion Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
