import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    // Get model from env or default to latest stable
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!apiKey || apiKey === 'your_gemini_api_key') {
      return NextResponse.json({ error: "Gemini API Key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { documentBase64, mimeType = "application/pdf" } = body;

    if (!documentBase64) {
      return NextResponse.json({ error: "No document provided" }, { status: 400 });
    }

    const buffer = Buffer.from(documentBase64, 'base64');
    let extractedText = "";
    let method = "vision"; // Default method

    // 1. Attempt Direct Text Extraction (if it's a PDF)
    if (mimeType === "application/pdf") {
      try {
        const data = await pdf(buffer);
        extractedText = data.text.trim();
        
        // If we found significant text, we can use text-only extraction (cheaper/faster)
        if (extractedText.length > 50) {
          method = "text";
          console.log("AI: Significant text found in PDF, using text-only extraction.");
        } else {
          console.log("AI: PDF seems to be a scanned image, falling back to vision.");
        }
      } catch (pdfError) {
        console.error("Direct PDF extraction failed, falling back to vision:", pdfError);
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    let result;
    const jsonFormatPrompt = `
      Return the data strictly in the following JSON format:
      {
        "patientName": "string",
        "patientEmail": "string",
        "claimAmount": number,
        "description": "string"
      }
    `;

    if (method === "text") {
      // TIER 1: Text-to-JSON
      const prompt = `
        You are a medical data extractor. Extract the following information from this text-based medical bill:
        1. Patient Full Name
        2. Patient Email (if present, otherwise empty string)
        3. Total Billed Amount (number only)
        4. Brief clinical description.

        Text to parse:
        """
        ${extractedText}
        """

        ${jsonFormatPrompt}
      `;
      result = await model.generateContent(prompt);
    } else {
      // TIER 2: Vision-to-JSON (Fallback for scanned PDFs or Images)
      const prompt = `
        You are a medical data extractor. Extract information from this medical insurance bill image:
        1. Patient Full Name
        2. Patient Email (if present, otherwise empty string)
        3. Total Billed Amount (number only)
        4. Brief clinical description.

        ${jsonFormatPrompt}
      `;
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: documentBase64,
            mimeType: mimeType
          },
        },
      ]);
    }

    const response = await result.response;
    const text = response.text();
    
    // Clean up response text
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const extractedData = JSON.parse(jsonStr);

    console.log(`AI: Successfully extracted data using ${method} method with model ${modelName}`);

    return NextResponse.json({
      success: true,
      data: extractedData,
      meta: { method, model: modelName }
    });

  } catch (error: any) {
    console.error("Advanced OCR Error:", error);
    return NextResponse.json({ 
      error: "AI Extraction Failed", 
      details: error.message 
    }, { status: 500 });
  }
}
