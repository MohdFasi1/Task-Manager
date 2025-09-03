import { NextResponse } from "next/server";
import { getGoogleToken } from "@/lib/getGoogleToken";
import { getGmailMessages } from "@/lib/gmail";

export async function GET() {
  try {
    const { accessToken } = await getGoogleToken();
    const messages = await getGmailMessages(accessToken);

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
