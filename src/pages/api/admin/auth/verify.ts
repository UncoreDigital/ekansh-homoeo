export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../lib/auth';

export const ALL: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);

  if (!auth.authorized) {
    return jsonResponse(
      {
        authenticated: false,
        authorized: false,
        error: auth.error,
      },
      auth.status || 401
    );
  }

  return jsonResponse({
    authenticated: true,
    authorized: true,
    user: auth.user,
  });
};
