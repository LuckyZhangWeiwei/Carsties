import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    DuendeIdentityServer6({
      id: "id-server",
      clientId: "nextApp",
      clientSecret: "secret",
      issuer: "http://localhost:5000",
      authorization: {
        params: { scope: "openid profile auctionApp" },
      },
      idToken: true,
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
