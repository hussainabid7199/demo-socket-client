import UserDto from "@/dtos/user-dto";
import axios from "axios";

import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "",
        },
        password: { label: "Password", type: "password" },
        subDomain: { label: "", type: "hidden" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
            },
            {
              headers: {
                "content-type": "application/json",
                clientid: process.env.NEXT_PUBLIC_API_CLIENT_ID,
              },
            }
          );
          return response.data;
        } catch (error) {
          console.log("error", error);
          return null;
        }
      },
    }),
  ],
  secret: `${process.env.NEXTAUTH_SECRET}`,
  callbacks: {
    async jwt({ token, user }) {
      // console.log("1 token", token, user, "user")
      return { ...token, ...user };
    },

    async session({ session, token }) {
      // session.user = (token.data as unknown as LoginDto).user;     
      const user = token.data as UserDto;
      session.user = user;
      return session;
    },
  },
  session: { strategy: "jwt" },
  events: {
    async signOut() {},
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/login",
  },
};
