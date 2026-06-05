import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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
    const { board, subjectName, className, messages, syllabusContext } = await req.json();

    if (!board || !subjectName || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Board, subject name, and message history are required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add it via Settings." },
        { status: 500 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Formulate a structured context prompt for the chat assistant
    const systemInstruction = `You are a warm, highly encouraging, and deeply knowledgeable academic counselor and subject tutor specializing in the CISCE curriculum (ICSE Class 10 and ISC Class 12).
The student is currently looking at: "${board} (Class ${className || (board === "ICSE" ? "10" : "12")}) ${subjectName}".

Use this core syllabus context if provided to help ground your answers:
${JSON.stringify(syllabusContext || "")}

Your goals:
1. Always be supportive, professional, and clear. Avoid jargon, but write with academic authority.
2. Provide practical and highly specific tips (e.g., recommend specific study strategies, memory tricks, or standard reference textbooks such as Selina, S. Chand, Frank, etc., if applicable to ICSE/ISC).
3. If they ask for practice questions, provide 2 or 3 high-quality ICSE/ISC style questions with answers (MCQs, short answer, or long-form, pointing out where students frequently lose marks).
4. Feel free to use markdown formatting (bolding, lists, code cards) to structure your responses elegantly. Keep responses concise but highly packed with useful details.`;

    // Map conversation array to Gemini content parts
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "I apologize, but I am unable to generate a response at this moment. Please try again.";

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Error in academic advisor chat API:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process chat message." },
      { status: 500 }
    );
  }
}
