// app/api/chat/history/route.ts
import { NextRequest } from 'next/server';
import connectDB from "@/app/_middleware/mongodb";
import ChatHistory from "@/app/_models/ChatHistory";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get wallet address from query parameters
    const walletAddress = request.nextUrl.searchParams.get('walletAddress');

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required" }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Fetch chat history
    const chatHistory = await ChatHistory.findOne({ walletAddress });

    // If no history exists, return empty messages array
    if (!chatHistory) {
      return new Response(
        JSON.stringify({ messages: [] }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ messages: chatHistory.messages }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Chat History API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while fetching chat history",
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}