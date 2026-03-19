import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages,
    });
    return NextResponse.json({ text: response.content[0].type === "text" ? response.content[0].text : "" });
  } catch (error) {
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}
