// app/api/personality-test/route.js
import dbConnect from '@/app/_middleware/mongodb';
import PersonalityTestResult from '@/app/_models/personalityResultSchema';
import Groq from 'groq-sdk';

export async function POST(req: { json: () => any; }) {
  try {
    await dbConnect();
    const data = await req.json();
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const structuredPrompt = `You are a highly empathetic AI therapist with expertise in personalized therapy.
    Your client has the following personality traits: ${JSON.stringify(data.personalityAnalysis)}.
    Based on these traits, provide tailored therapeutic guidance and recommendations.
    If required, suggest a therapist specializing in ${JSON.stringify(data.recommendedTherapist)}.
    Ensure your responses are supportive, understanding, and insightful.`;

    const groqResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: structuredPrompt }],
    });

    const contextParagraph = groqResponse.choices[0].message.content;
    console.log('Context paragraph:', contextParagraph);
    const newResult = new PersonalityTestResult({
      walletAddress: data.walletAddress,
      contextParagraph,
    });

    await newResult.save();

    return new Response(JSON.stringify({ message: 'Result saved successfully!', contextParagraph }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving personality test result:', error);
    return new Response(JSON.stringify({ error: 'Failed to save result.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}