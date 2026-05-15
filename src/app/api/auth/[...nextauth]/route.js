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
    async jwt({ token, account, profile }) {
  // account and profile ONLY exist when the user first signs in
  if (account && profile) {
    await dbConnect();
    
    // This is the "Auto-Create" magic
    await User.findOneAndUpdate(
      { steamId: token.sub },
      { 
        steamId: token.sub, 
        name: profile.personaname, 
        image: profile.avatarfull,
        // We do not set isAdmin here, so they default to a normal user
      },
      { upsert: true, new: true } 
    );

    token.name = profile.personaname;
  }

  // Always check admin status from DB on every token refresh
  if (token.sub) {
    const dbUser = await User.findOne({ steamId: token.sub });
    token.isAdmin = dbUser?.isAdmin === true || token.sub === process.env.ADMIN_STEAM_ID;
  }

  return token;
},
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub; 
        session.user.steamId = token.sub;
        // This passes the name to the frontend and your registration forms
        session.user.name = token.name; 
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