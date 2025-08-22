
import { parse } from 'cookie';

// The correct, final endpoint for the Featherless Text Completions API.
const FEATHERLESS_API_ENDPOINT = "https://api.featherless.ai/v1/completions";

export async function POST(request) {
  try {
    // 1. Read API key from cookie (no changes here).
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return new Response(JSON.stringify({ error: 'Authorization cookie not found.' }), { status: 401 });
    }
    const cookies = parse(cookieHeader);
    const apiKey = cookies['api-key'];

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not found in cookie.' }), { status: 401 });
    }

    // 2. Read prompt data from client (no changes here).
    const { prompt, modelName } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), { status: 400 });
    }

    // 3. Construct the request body for the Text Completions endpoint.
    const featherlessRequestBody = {
      model: modelName || 'deepseek-ai/DeepSeek-R1-0528', // Use their suggested default or your preferred model
      prompt: prompt,
      max_tokens: 1500,
      temperature: 0.7,
    };

    // 4. Make the proxied request to the correct Featherless endpoint.
    const featherlessResponse = await fetch(FEATHERLESS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(featherlessRequestBody),
    });

    // 5. Check for errors from Featherless (no changes here).
    if (!featherlessResponse.ok) {
      const errorBody = await featherlessResponse.json();
      console.error('Error from Featherless:', errorBody);
      return new Response(JSON.stringify(errorBody), { status: featherlessResponse.status });
    }

    // 6. Stream the response back to our client (no changes here).
    return new Response(featherlessResponse.body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/generate:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}