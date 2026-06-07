import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/utils/db";
import User from "@/lib/models/User";

import Organization from "@/lib/models/Organization";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Auth DEBUG: Attempting login for", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("Auth DEBUG: Missing email or password");
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log("Auth DEBUG: User not found in DB");
            return null;
          }

          console.log("Auth DEBUG: User found, comparing password...");
          
          // Check if comparePassword exists (it might not if it's a lean object)
          if (typeof user.comparePassword !== 'function') {
            console.error("Auth DEBUG: CRITICAL - user.comparePassword is not a function!");
            // Fallback to direct bcrypt comparison if method is missing
            const bcrypt = await import('bcryptjs');
            const isMatch = await bcrypt.default.compare(credentials.password as string, user.password);
            if (!isMatch) {
              console.log("Auth DEBUG: Password mismatch (manual bcrypt)");
              return null;
            }
          } else {
            const isMatch = await user.comparePassword(credentials.password);
            if (!isMatch) {
              console.log("Auth DEBUG: Password mismatch");
              return null;
            }
          }

          // Fetch Org branding for the session
          const org = await Organization.findById(user.organizationId);

          console.log("Auth DEBUG: Login successful for", user.email);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId.toString(),
            providerId: user.providerId?.toString() || null,
            branding: org?.branding || null
          };
        } catch (error) {
          console.error("Auth DEBUG: Error in authorize callback", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.organizationId = (user as any).organizationId;
        token.providerId = (user as any).providerId;
        token.branding = (user as any).branding;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).providerId = token.providerId;
        (session.user as any).branding = token.branding;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: true, // Enable debug messages
});
