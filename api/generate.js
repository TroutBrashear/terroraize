
import { parse } from 'cookie';

// The correct, final endpoint for the Featherless Text Completions API.
const FEATHERLESS_API_ENDPOINT = "https://api.featherless.ai/v1/completions";
const GOOGLE_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/";

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

    const { prompt, modelName, provider } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), { status: 400 });
    }

    
    switch (provider) {
      case 'featherless':
        const featherlessRequestBody = {
         model: modelName || 'deepseek-ai/DeepSeek-R1-0528',
         prompt: prompt,
         max_tokens: 1500,
         temperature: 0.7,
        };
        const featherlessResponse = await fetch(FEATHERLESS_API_ENDPOINT, {
          method: 'POST',
          headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(featherlessRequestBody),
        });

        if (!featherlessResponse.ok) {
         const errorBody = await featherlessResponse.json();
         console.error('Error from Featherless:', errorBody);
         return new Response(JSON.stringify(errorBody), { status: featherlessResponse.status });
        }

        return new Response(featherlessResponse.body, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      case 'google':
        const googleRequestBody = {
          "contents": [{ "parts": [{ "text": prompt }] }]
        };
        const chosenModel = modelName || 'gemini-pro';
        const constructedEndpoint = `${GOOGLE_API_ENDPOINT}${chosenModel}:generateContent`;
        const googleResponse = await fetch(constructedEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(googleRequestBody),
        });

        if(!googleResponse.ok) {
          const errorBody = await googleResponse.json();
          console.error('Error from Google:', errorBody);
          return new Response(JSON.stringify(errorBody), { status: googleResponse.status });
        }

        return new Response(googleResponse.body, {
          status: 200,
          headers: { 'Content-Type': 'application/json'},
        });
    } 
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}