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
  async jwt({ token, account, profile }) {
  if (account && profile) {
    await dbConnect();
    
    // This line is the "Auto-Register" for the users collection
    // It creates the user document if it doesn't exist, or updates it if it does
    await User.findOneAndUpdate(
      { steamId: token.sub },
      { 
        steamId: token.sub, 
        name: profile.personaname, 
        image: profile.avatarfull 
      },
      { upsert: true, new: true }
    );

    // Check admin status
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