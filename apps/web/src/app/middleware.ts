// import { NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';
// import type { NextRequest } from 'next/server';

// function getJwtSecretKey() {
//   const secret = 'superdupersecretyoucannotguessitever!';
//   if (!secret || secret.length === 0) {
//     throw new Error('The environment variable JWT_SECRET is not set.');
//   }
//   return secret;
// }

// async function verifyJwtToken(token: string) {
//   try {
//     const verified = await jwtVerify(
//       token,
//       new TextEncoder().encode(getJwtSecretKey()),
//     );
//     return verified.payload;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Your token is expired or not valid');
//     }
//   }
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('accessToken')?.value;
//   if (!token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   const verifiedToken = await verifyJwtToken(token).catch((err) => {
//     console.log(err);
//   });

//   if (!verifiedToken) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   const role = verifiedToken.role as string;

//   if (role) {
//     if (pathname.startsWith('/dashboard/user') && role === 'CUSTOMER') {
//       return NextResponse.next();
//     } else if (
//       pathname.startsWith('/dashboard/organizer') &&
//       role === 'ORGANIZER'
//     ) {
//       return NextResponse.next();
//     } else {
//       return NextResponse.redirect(new URL('/not-found', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/organizer/dashboard', '/user/dashboard'],
// };

// /* -------------------------------------------------------------------------- */
// /*                                 KODE FARREL                                */
// /* -------------------------------------------------------------------------- */

// // import { NextResponse } from 'next/server';
// // import { NextRequest } from 'next/server';

// // export function middleware(request: NextRequest) {
// //   const userRole = request.cookies.get('role');
// //   if (userRole?.toString() !== 'SUPERADMIN') {
// //     return NextResponse.redirect(new URL('/', request.url));
// //   }
// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: ['/manage-stores/*', '/reports-stock/*'],
// // };
