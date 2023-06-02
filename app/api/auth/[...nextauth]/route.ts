import prisma from "@/app/lib/prisma";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "someone@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });
          if (!user) {
            return null;
          }

          const isValisPassword = await compare(
            credentials.password,
            user.password
          );

          if (!isValisPassword) {
            return null;
          }

          return {
            ...user,
            id: user.id.toString(),
          };
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: "",
      clientSecret: "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
