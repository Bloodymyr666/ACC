import NextAuth from "next-auth";
import SteamProvider from "next-auth-steam";
import dbConnect from "@/lib/db"; 
import User from "@/models/User";

export const getAuthOptions = (req) => ({
  providers: [
    ...(req ? [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET,
        // FORCE the callback to use HTTPS and the correct Vercel path
        callbackUrl: "https://acc-teal.vercel.app/api/auth/callback/steam",
      })
    ] : []),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // 1. THIS BUILDS YOUR USER DATABASE AUTOMATICALLY
      if (account && profile) {
        try {
          await dbConnect();
          const user = await User.findOneAndUpdate(
            { steamId: token.sub },
            { 
              steamId: token.sub, 
              name: profile.personaname, 
              image: profile.avatarfull 
            },
            { upsert: true, new: true }
          );
          token.name = profile.personaname;
          token.isAdmin = user?.isAdmin === true || token.sub === process.env.ADMIN_STEAM_ID;
        } catch (error) {
          console.error("Database error during login:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

const handler = (req, res) => NextAuth(req, res, getAuthOptions(req));
export { handler as GET, handler as POST };