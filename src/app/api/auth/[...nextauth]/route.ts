import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (res.ok && data.accessToken) {
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            image: data.user.profile_image_url,
            accessToken: data.accessToken,
          };
        }

        return null;
      },


    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora
  },
  jwt: {
    maxAge: 60 * 60, // 1 hora
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;

        // Obtener datos del usuario desde /auth/me
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          token.id = userData.id;
          token.role = userData.role;
          token.name = userData.name;
          token.email = userData.email;
          token.image = userData.profile_image_url ?? null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        role: token.role,
        name: token.name,
        email: token.email,
        image: token.image,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
