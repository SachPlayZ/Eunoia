import { NextRequest } from 'next/server';
import connectDB from "@/app/_middleware/mongodb";
import PersonalityTestResult from "@/app/_models/personalityResultSchema";
import ChatHistory from "@/app/_models/ChatHistory";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import {franc} from 'franc-min'; // Lightweight language detection library

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { walletAddress, userMessage } = await req.json();

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required for personalized chat" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!userMessage?.trim()) {
      return new Response(
        JSON.stringify({ error: "Please provide a message to continue the conversation" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Detect language
    const detectedLang = franc(userMessage, { minLength: 3 });
    const isHindi = detectedLang === 'hin';
    const languageInstruction = isHindi 
      ? "अपने उत्तर हिंदी में दें।" 
      : "Respond in English.";

    // Fetch user context
    const result = await PersonalityTestResult.findOne({ walletAddress });

    if (!result) {
      return new Response(
        JSON.stringify({ 
          error: "Please complete the personality test before starting a chat",
          code: "NO_PERSONALITY_TEST"
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not configured");
    }

    const model = new ChatGroq({
      modelName: "llama-3.3-70b-versatile",
      temperature: 0.7,
      apiKey: process.env.GROQ_API_KEY,
    });

    // Fetch existing chat history
    let chatHistory = await ChatHistory.findOne({ walletAddress });
    const conversationHistory = chatHistory?.messages
      ?.slice(-6)
      ?.map((msg: { role: any; message: any; }) => `${msg.role}: ${msg.message}`)
      ?.join('\n') || 'No previous conversation';

    // Updated prompt with bilingual instruction
    const prompt = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant personalized for this user. Here is important context about the user:
      {context}
      
      Previous conversation context (if any):
      {conversationHistory}
      
      Please provide a response that:
      1. Takes into account the user's personality and preferences.
      2. Maintains consistency with previous conversations.
      3. Is helpful and relevant to the current query.
      4. The answers do not exceed 2-3 sentences at max.
      5. You are the therapist; you need to build conversation with them and make them feel secure instead of suggesting they reach out to an actual therapist.
      6. Don't say stuff like "Based on your preferences" or "According to the context," just talk like a normal conversation.
      7. ${languageInstruction}

      Current message: {question}
      Assistant:
    `);

    const chain = RunnableSequence.from([
      {
        context: (input: any) => input.context,
        conversationHistory: (input: any) => input.conversationHistory,
        question: (input: any) => input.question,
      },
      prompt,
      model,
      new StringOutputParser()
    ]);

    const botResponse = await chain.invoke({
      context: result.contextParagraph,
      conversationHistory,
      question: userMessage,
    });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        walletAddress,
        messages: [],
      });
    }

    if (typeof botResponse !== 'string') {
      throw new Error("Invalid response format received from AI model");
    }

    chatHistory.messages.push(
      { role: "user", message: userMessage },
      { role: "assistant", message: botResponse }
    );

    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }

    await chatHistory.save();

    return new Response(
      JSON.stringify({ botResponse }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorResponse = {
      error: "Failed to process chat message",
      details: errorMessage,
      code: error instanceof Error ? error.name : 'UNKNOWN_ERROR'
    };

    return new Response(
      JSON.stringify(errorResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
