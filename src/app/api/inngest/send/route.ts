import { inngest } from "@/lib/inngest/client";
import { EXTRACT_FROM_RECEIPT_AND_SAVE_TO_DB } from "@/lib/inngest/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, id } = body;

    await inngest.send({
      name: EXTRACT_FROM_RECEIPT_AND_SAVE_TO_DB,
      data: {
        url,
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send Inngest event:", error);
    return NextResponse.json(
      { error: "Failed to send Inngest event" },
      { status: 500 },
    );
  }
}
