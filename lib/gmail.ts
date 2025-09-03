// lib/gmail.ts
import { google } from "googleapis";

export async function getGmailMessages(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10, // adjust
  });

  return res.data.messages || [];
}
