import { NextRequest } from "next/server";
import dbConnect from "@/app/_middleware/mongodb";
import PersonalityTestResult from "@/app/_models/personalityResultSchema";
import Groq from "groq-sdk";

interface PersonalityAnalysis {
  personalityTraits: string;
  communicationStyle: string;
  behavioralPatterns: string;
}

interface RecommendedTherapist {
  typeOfTherapist: string;
  therapeuticApproach: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json() as {
      walletAddress: string;
      personalityAnalysis: PersonalityAnalysis;
      recommendedTherapist: RecommendedTherapist;
    };

    const { walletAddress, personalityAnalysis, recommendedTherapist } = data;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const structuredPrompt = `You are a highly empathetic AI therapist with expertise in personalized therapy.
    Your client has the following personality traits: ${JSON.stringify(personalityAnalysis)}.
    Based on these traits, provide tailored therapeutic guidance and recommendations.
    If required, suggest a therapist specializing in ${JSON.stringify(recommendedTherapist)}.
    Ensure your responses are supportive, understanding, and insightful.`;

    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: structuredPrompt }],
    });

    const contextParagraph = groqResponse.choices[0].message.content;
    console.log("Context paragraph:", contextParagraph);

    const newResult = new PersonalityTestResult({
      walletAddress,
      contextParagraph,
    });

    await newResult.save();

    return new Response(
      JSON.stringify({ message: "Result saved successfully!", contextParagraph }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving personality test result:", error);
    return new Response(JSON.stringify({ error: "Failed to save result." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
