import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/lookup-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: user.email }),
          },
        );
        const userData = await response.json();

        if (!userData.data) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/create-user`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                name: user.name,
                username: user.name,
                email: user.email,
                profileImage: user.image,
                emailConfirmed: true,
                passwordConfirmed: true,
              }),
            },
          );

          if (!response.ok) {
            const data = await response.json();
            console.log(data);
            console.error('Failed to create user');
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/lookup-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: user.email }),
          },
        );
        const userData = await response.json();
        token.id = userData.data.id;
        token.name = userData.data.name;
        token.username = userData.data.username;
        token.profileImage = userData.data.profileImage;
        token.role = userData.data.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.profileImage = token.profileImage as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  jwt: {
    encode: ({ token }) => {
      if (!token) {
        throw new Error('No token provided');
      }
      return jwt.sign(token, process.env.JWT_SECRET_KEY as string);
    },
    decode: ({ token }) => {
      if (!token) {
        throw new Error('No token provided');
      }
      return jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JWT;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  cookies: {
    sessionToken: {
      name: 'accessToken',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});

// CODE UNTUK DEPLOY

// cookies: {
//   sessionToken: {
//     name: 'accessToken',
//     options: {
//       httpOnly: true,
//       sameSite: 'none',
//       path: '/',
//       secure: process.env.NODE_ENV === 'production',
//     },
//   },
// },

// CODE UNTUK LOCAL

// cookies: {
//   sessionToken: {
//     name: 'accessToken',
//     options: {
//       httpOnly: true,
//       sameSite: 'lax',
//       domain:
//         process.env.NODE_ENV === 'development' ? 'localhost' : 'quickmart',
//       path: '/',
//       secure: process.env.NODE_ENV === 'production',
//     },
//   },
// },
