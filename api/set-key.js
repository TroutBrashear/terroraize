import { serialize } from 'cookie';

export async function POST(request) {
  
  //expect to receive body.apiKey only.
  const body = await request.json();
  const apiKey = body.apiKey;
  
  
  const cookieOptions = {
      httpOnly: true,  
      secure: process.env.NODE_ENV !== 'development', 
      sameSite: 'strict', 
      path: '/',          
      maxAge: 60 * 60 * 24 * 30, 
    };

    const serializedCookie = serialize('api-key', apiKey, cookieOptions);
	
	
    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: {
        'Set-Cookie': serializedCookie,
        'Content-Type': 'application/json',
      },
    });
}