import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Instantiate the SDK as recommended on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { board, subjectName, className } = await req.json();

    if (!board || !subjectName) {
      return NextResponse.json(
        { error: "Board and subject name are required parameters." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add it via Settings." },
        { status: 500 }
      );
    }

    // Prompt Gemini to structure the response carefully
    const prompt = `Provide the current and authentic CISCE syllabus details for ${board} (Class ${className || (board === "ICSE" ? "10" : "12")}) subject: "${subjectName}".
Deliver precise official details. Do not use generic placeholders.

Include:
1. Marking Scheme: Theory vs Practical assessment weightage, internal assessment guidelines, total marks.
2. Question Paper Pattern: Structure of the final examination paper (e.g. Sections, number of questions, compulsory questions, optional questions, mark distribution).
3. Detailed Syllabus Curriculum: Main chapters, units, core concepts, and unit-wise weightage (if applicable).
4. Expert Strategy & Study Tips: Pro study tips on how to prepare, score 100%, and avoid common student mistakes in this subject.`;

    const systemInstruction = `You are an expert curriculum designer and CISCE academic advisor with decades of experience guiding students for ICSE (Class 10) and ISC (Class 12).
Provide highly structured, precise, and practical information about subject syllabi, marking schemes, and exam formats of the CISCE council.
Always respond in the exact JSON schema provided. Deliver rich, detailed text (use list items or sub-sections inside strings where appropriate).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The official name of the subject.",
            },
            board: {
              type: Type.STRING,
              description: "ICSE or ISC.",
            },
            grade: {
              type: Type.STRING,
              description: "Class 10 or Class 12.",
            },
            totalMarks: {
              type: Type.INTEGER,
              description: "Total maximum marks (usually 100).",
            },
            markingScheme: {
              type: Type.OBJECT,
              properties: {
                theoryMarks: {
                  type: Type.INTEGER,
                  description: "Theory paper maximum marks.",
                },
                practicalMarks: {
                  type: Type.INTEGER,
                  description: "Practical / project / internal assessment marks.",
                },
                breakdown: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Detailed bulleted breakdown of how marks are awarded (e.g., project work, laboratory work, regular assignments).",
                },
              },
              required: ["theoryMarks", "practicalMarks", "breakdown"],
            },
            questionPattern: {
              type: Type.OBJECT,
              properties: {
                duration: {
                  type: Type.STRING,
                  description: "Time duration allowed for the exam (e.g., 2 hours, 3 hours).",
                },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "e.g., Section A, Section B." },
                      marks: { type: Type.STRING, description: "Marks allocated to this section." },
                      compulsory: { type: Type.BOOLEAN, description: "Whether this section is fully compulsory." },
                      description: { type: Type.STRING, description: "Types of questions (such as MCQ, short answer, descriptive, numericals) and choice options." },
                    },
                    required: ["name", "marks", "compulsory", "description"],
                  },
                },
                overallStructure: {
                  type: Type.STRING,
                  description: "Summary of overall choices and formatting restrictions of the question paper.",
                },
              },
              required: ["duration", "sections", "overallStructure"],
            },
            syllabus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  unitName: { type: Type.STRING, description: "Unit/Chapter title." },
                  weightage: { type: Type.STRING, description: "Suggested marks weightage or high/medium/low priority note." },
                  topics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key concepts and micro-topics covered under this unit.",
                  },
                },
                required: ["unitName", "weightage", "topics"],
              },
            },
            expertTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Professional preparation tips, study approaches, and scoring insights.",
            },
          },
          required: [
            "title",
            "board",
            "grade",
            "totalMarks",
            "markingScheme",
            "questionPattern",
            "syllabus",
            "expertTips",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in subject-detail API:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve subject details." },
      { status: 500 }
    );
  }
}
