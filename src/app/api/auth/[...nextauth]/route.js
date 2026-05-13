import NextAuth from "next-auth";
import SteamProvider from "next-auth-steam";
import dbConnect from "@/lib/db"; 
import User from "@/models/User";

export const getAuthOptions = (req) => ({
  providers: [
    // Only initialize SteamProvider if req is present (browser-side)
    ...(req ? [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET,
        callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
      })
    ] : []),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        await dbConnect();
        const dbUser = await User.findOne({ steamId: token.sub });
        token.isAdmin = dbUser?.isAdmin === true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Map the sub (Steam ID) to session.user.id for the registration API
        session.user.id = token.sub; 
        session.user.steamId = token.sub;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

async function handler(req, res) {
  return await NextAuth(req, res, getAuthOptions(req));
}

export { handler as GET, handler as POST };