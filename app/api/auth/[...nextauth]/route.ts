/**
 * NextAuth configuration for authentication.
 * Handles user login and session management for the blogging app.
 */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Hardcoded user for demo purposes. In a real app, this would query a database.
 */
const demoUser = { id: "1", username: "admin", password: "password123" };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === demoUser.username &&
          credentials?.password === demoUser.password
        ) {
          return { id: demoUser.id, name: demoUser.username };
        }
        return null; // Return null if authentication fails
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page (not implemented here, use API for simplicity)
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key", // Set this in .env
};

/**
 * NextAuth handler for all authentication routes.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
