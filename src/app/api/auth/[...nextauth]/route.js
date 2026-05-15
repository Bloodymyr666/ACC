import NextAuth from "next-auth";
import SteamProvider from "next-auth-steam";
import dbConnect from "@/lib/db"; 
import User from "@/models/User";

export const getAuthOptions = (req) => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = req ? req.headers['host'] : process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '');

  return {
    providers: [
      ...(req ? [
        SteamProvider(req, {
          clientSecret: process.env.STEAM_SECRET,
          callbackUrl: `${protocol}://${host}/api/auth/callback/steam`,
        })
      ] : []),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account && profile) {
          await dbConnect();
          // This creates your user document automatically in the new DB
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
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.sub;
          session.user.steamId = token.sub;
          session.user.name = token.name;
          session.user.isAdmin = token.isAdmin || false;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
};

const handler = (req, res) => NextAuth(req, res, getAuthOptions(req));
export { handler as GET, handler as POST };