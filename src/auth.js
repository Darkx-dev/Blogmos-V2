import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "./lib/models/UserModel";
import ConnectDB from "./lib/config/db";

export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        await ConnectDB();
        const user = await UserModel.findOne({ email: profile.email });
        if (user) {
          token.isAdmin = user.isAdmin;
          token._id = user._id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.isAdmin = token.isAdmin;
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider == "google") {
        await ConnectDB();
        const existingUser = await UserModel.findOne({ email: profile.email });
        if (existingUser) {
          existingUser.name = profile.name;
          existingUser.profileImg = profile.picture;
          await existingUser.save();
        } else {
          await UserModel.create({
            name: profile.name,
            email: profile.email,
            profileImg: profile.picture,
            isAdmin: false,
            password: account.access_token, // Placeholder for real password hashing.
          });
        }
        return true;
      }
      return true;
    },
  },
  pages: {
    error: "/error",
    signIn: "/login",
    signOut: "/logout",
  },
  theme: {
    colorScheme: "light",
    brandColor: "#ffffff",
    buttonText: "Login",
    logo: "https://inspiredcoder.vercel.app/_next/image?url=%2Flogo.png&w=64&q=75",
  },
  secret: process.env.AUTH_SECRET,
});
