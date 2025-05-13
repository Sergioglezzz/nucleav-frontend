import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard',
    '/profile/:path*',
    '/proyectos/:path*',
    '/red/:path*',
    '/material/:path*',
    '/empresa/:path*',
  ],
};
