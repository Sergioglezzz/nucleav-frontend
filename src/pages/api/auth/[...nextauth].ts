import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Puedes agregar más proveedores como Google, GitHub, etc.

const backendOrigin = process.env.NEXT_PUBLIC_API_URL;

const loginEndpoint = `${backendOrigin}/v1/login/`;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aquí conectas con tu backend para verificar usuario
        const loginResponse = await fetch(loginEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await loginResponse.json();
        if (!loginResponse.ok) {
          return { id: "0", error: "Usuario y/o contraseña incorrectos" };
        }

        if (loginResponse.ok && user && !user.Error) {
          // Any object returned will be saved in `user` property of the JWT
          return {
            accessToken: user.access_token,
            refreshToken: user.refresh_token,
            id: user.user_info.id,
            username: user.user_info.username,
            email: user.user_info.email,
            role: user.user_info.roles[0],
          };
        }

        return user ? user : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Página personalizada de login
    error: "/login",
  },
});
