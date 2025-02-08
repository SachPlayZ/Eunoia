// app/api/analyze-personality/route.ts
import { NextRequest } from 'next/server';
import { Groq } from 'groq-sdk';
import { z } from 'zod';

// Initialize the GROQ client with error handling
const createGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }
  return new Groq({ apiKey });
};

// Define schema for request validation
const PersonalityDataSchema = z.object({
  data: z.array(z.object({
    question: z.string(),
    answer: z.string().min(1, "Answer cannot be empty")
  }))
});

// Define response types for better type safety
interface AnalysisResponse {
  personalityAnalysis: string;
  recommendedTherapist: string;
}

// Custom error class for structured error handling
class AnalysisError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

// Helper function to create the analysis prompt
function createAnalysisPrompt(data: { question: string; answer: string }[]): string {
  const formattedQA = data
    .map(qa => `Question: ${qa.question}\nAnswer: ${qa.answer}`)
    .join('\n\n');

  return `As an expert psychologist, analyze the following personality assessment responses and provide two things:
    1. A detailed personality analysis
    2. A specific recommendation for the type of therapist that would be most helpful for this person
    
    Here are the responses:
    
    ${formattedQA}
    
    Please provide your analysis in JSON format with two fields:
    - personalityAnalysis: A detailed analysis of their personality traits, communication style, and behavioral patterns
    - recommendedTherapist: A specific recommendation for the type of therapist that would be most beneficial, including the therapeutic approach that would work best
    
    Focus on being constructive and empathetic in your analysis.`;
}

// Main API route handler
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = PersonalityDataSchema.safeParse(body);

    if (!validatedData.success) {
      throw new AnalysisError(
        'Invalid request data',
        400,
        validatedData.error.format()
      );
    }

    // Initialize GROQ client
    const groq = createGroqClient();

    // Generate the analysis
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: createAnalysisPrompt(validatedData.data.data)
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    // Extract and validate the response
    const responseContent = completion.choices[0]?.message?.content;
    console.log('GROQ response:', responseContent);
    if (!responseContent) {
      throw new AnalysisError('No analysis generated', 500);
    }

    // Parse and validate the GROQ response
    const analysis = JSON.parse(responseContent) as AnalysisResponse;
    console.log('Personality analysis:', analysis);
    
    if (!analysis.personalityAnalysis || !analysis.recommendedTherapist) {
      throw new AnalysisError('Invalid analysis format', 500);
    }

    // Return successful response
    return Response.json(analysis, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Personality analysis error:', error);

    // Handle different types of errors
    if (error instanceof AnalysisError) {
      return Response.json(
        {
          error: error.message,
          details: error.details
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: 'Validation error',
          details: error.format()
        },
        { status: 400 }
      );
    }

    // Generic error response
    return Response.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

