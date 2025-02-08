import  connectDB from "@/app/_middleware/mongodb";
import PersonalityTestResult from "@/app/_models/personalityResultSchema";

export async function POST(req: { json: () => PromiseLike<{ walletAddress: any; }> | { walletAddress: any; }; }) {
  try {
    await connectDB();
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return new Response(JSON.stringify({ error: "Wallet address required" }), {
        status: 400,
      });
    }

    const result = await PersonalityTestResult.findOne({ walletAddress });

    if (!result) {
      return new Response(
        JSON.stringify({ error: "No context found for this wallet address" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ contextParagraph: result.contextParagraph }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
