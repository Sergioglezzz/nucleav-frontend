import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard',
    '/proyectos/:path*',
    '/materiales/:path*',
    '/equipo/:path*',
    '/profile',
    '/profile/edit',
  ],
};
