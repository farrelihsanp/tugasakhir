import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

async function verifyJwtToken(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY),
    );
    return verified.payload;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Your token is expired or not valid');
    }
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  console.log('isinya token', token);

  const verifiedToken = await verifyJwtToken(token);
  if (!verifiedToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log(verifiedToken);

  const { pathname } = request.nextUrl;
  const role = verifiedToken.role as string;

  if (role) {
    // SUPERADMIN CHECK
    if (role === 'SUPERADMIN') {
      return NextResponse.next();
    }

    // REPORTS STOCK CHECK
    if (pathname.startsWith('/reports-stock') && role === 'STOREADMIN') {
      return NextResponse.next();
    }

    // CUSTOMER CHECK
    const customerPaths = [
      /^\/dashboard\/[^/]+\/manual-transfer$/,
      /^\/dashboard\/[^/]+\/payment$/,
      /^\/dashboard\/[^/]+\/checkout$/,
      /^\/dashboard\/[^/]+\/my-cart$/,
      /^\/dashboard\/[^/]+\/my-orders$/,
      /^\/dashboard\/[^/]+\/my-vouchers$/,
    ];

    const isCustomerPath = customerPaths.some((pattern) =>
      pattern.test(pathname),
    );

    if (isCustomerPath && role === 'CUSTOMERS') {
      return NextResponse.next();
    }

    // STORE ADMIN CHECK
    const storeadminPaths = [
      /^\/dashboard\/[^/]+\/reports-analysis$/,
      /^\/dashboard\/[^/]+\/view-orders$/,
      /^\/dashboard\/[^/]+\/vouchers$/,
    ];

    const isStoreadminPath = storeadminPaths.some((pattern) =>
      pattern.test(pathname),
    );

    if (isStoreadminPath && role === 'STOREADMIN') {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/dashboard/:path*', '/reports-stock/:path*'],
};

/* -------------------------------------------------------------------------- */
/*                                 KODE FARREL                                */
/* -------------------------------------------------------------------------- */

// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const userRole = request.cookies.get('role');
//   if (userRole?.toString() !== 'SUPERADMIN') {
//     return NextResponse.redirect(new URL('/', request.url));
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/manage-stores/*', '/reports-stock/*'],
// };
