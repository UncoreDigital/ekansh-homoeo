export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  // Clear the cookie by setting Max-Age=0
  const expiredCookie = 'sb_access_token=; Path=/; Max-Age=0; SameSite=Lax;';

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Logged out successfully.',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': expiredCookie,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
};
