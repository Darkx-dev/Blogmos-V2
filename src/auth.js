import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "./lib/models/UserModel";
import ConnectDB from "./lib/config/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        await ConnectDB();
        let user = null;
        user = await UserModel.findOne({ email: credentials.email });
        console.log(user);
        if (!user) {
          throw new CredentialsSignin("User not found");
        }
        const isPasswordValid = bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log(credentials.password);
        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid password");
        }
        return user;
      },
    }),
  ],
  pages: {
    // signIn: "/login",
    // signOut: "/signout",
    // newUser: "/register",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.name = user.name;
        token.password = user.password;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin;
        session.user.password = token.password;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
