import NextAuth from "next-auth";
import SteamProvider from "next-auth-steam";
import dbConnect from "@/lib/db"; 
import User from "@/models/User";

const handler = async (req, res) => {
  return await NextAuth(req, res, {
    providers: [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET,
        // HARDCODED to prevent Vercel from using 'http'
        callbackUrl: "https://acc-teal.vercel.app/api/auth/callback/steam",
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account && profile) {
          try {
            await dbConnect(); // Using your lib/db.js here!
            
            // This is what finally puts the name into Atlas
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
          } catch (err) {
            console.error("Critical Database Error:", err);
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
    // Forces the browser to use secure production cookies
    cookies: {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true
        }
      }
    }
  });
};

export { handler as GET, handler as POST };