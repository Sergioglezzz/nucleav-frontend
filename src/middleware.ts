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
    '/project/:path*',
    '/network/:path*',
    '/material/:path*',
    '/company/:path*',
  ],
};
