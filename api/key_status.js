import { parse } from 'cookie';

export function GET(request) {
  // Read the cookies from the incoming request headers.
  const cookieHeader = request.headers.get('cookie');
  
  if (cookieHeader) {
    const cookies = parse(cookieHeader);
    // Check if our specific cookie exists.
    if (cookies['api-key']) {
      // The cookie exists. Report true.
      return new Response(JSON.stringify({ hasKey: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // If we reach here, the cookie does not exist. Report false.
  return new Response(JSON.stringify({ hasKey: false }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}