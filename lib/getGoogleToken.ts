import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getGoogleToken() {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await clerkClient.users.getUser(userId);

  const googleAccount = user.externalAccounts.find(
    (acc) => acc.provider === "oauth_google"
  );

  if (!googleAccount) throw new Error("No Google account linked");

  return {
    accessToken: googleAccount.oauthAccessToken,
    refreshToken: googleAccount.oauthRefreshToken,
  };
}
