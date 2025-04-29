import CredentialsProvider from "next-auth/providers/credentials";
import { decode } from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    user_id?: string;
    picture?: string;
    user_metadata?: Record<string, unknown>;
  }
}

interface DecodedIdToken {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_ISSUER, AUTH0_TOKEN_URL } = process.env;

        if (!AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET || !AUTH0_ISSUER || !AUTH0_TOKEN_URL) {
          throw new Error("Auth0 environment variables are not set");
        }

        const body = {
          client_id: AUTH0_CLIENT_ID,
          client_secret: AUTH0_CLIENT_SECRET,
          grant_type: "password",
          username: credentials.username,
          password: credentials.password,
          connection: "Username-Password-Authentication",
        };

        try {
          const response = await fetch(AUTH0_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const res = await response.json();

          if (!response.ok) {
            throw new Error(`Error fetching token: ${res.error_description || response.statusText}`);
          }

          const { access_token, id_token } = res;

          if (!access_token || !id_token) {
            throw new Error("Missing access token or ID token");
          }

          const decoded = decode(id_token) as DecodedIdToken;

          if (!decoded?.sub) {
            throw new Error("Failed to decode ID token");
          }

          const user = {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            user_metadata: decoded.user_metadata || {},
            token: access_token,
          };

          return user;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 1, // 1 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.picture;
        token.role = user.user_metadata?.role;
        token.contact = user.user_metadata?.contact;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      const base = process.env.NEXTAUTH_URL || baseUrl;
      if (url.startsWith(base)) return url;
      else if (url.startsWith("/")) return new URL(url, base).toString();
      return `${base}/admin`;
    },
  },
};
