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
  if (account && profile) {
    await dbConnect();
    
    // This part AUTOMATICALLY creates/updates the user in your database
    const user = await User.findOneAndUpdate(
      { steamId: token.sub },
      { 
        steamId: token.sub, 
        name: profile.personaname, // This grabs their Steam IGN
        image: profile.avatarfull 
      },
      { upsert: true, new: true } // 'upsert' means create if doesn't exist
    );

    token.isAdmin = user?.isAdmin === true;
    token.name = profile.personaname;
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