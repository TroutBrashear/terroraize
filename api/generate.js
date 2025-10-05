
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

    let requestBody;
    let requestHeader;
    let requestEndpoint;
    
    switch (provider) {
      case 'featherless':
        requestBody = {
         model: modelName || 'deepseek-ai/DeepSeek-R1-0528',
         prompt: prompt,
         max_tokens: 1500,
         temperature: 0.7,
        };

        requestHeader = { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };

        requestEndpoint = FEATHERLESS_API_ENDPOINT;
        break;

      case 'google': //GOOGLE GEMINI
        requestBody = {
          "contents": [{ "parts": [{ "text": prompt }] }]
        };
        requestHeader = {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        };
        const chosenModel = modelName || 'gemini-pro';
        requestEndpoint = `${GOOGLE_API_ENDPOINT}${chosenModel}:generateContent`;
        break;
      }
       
      const serviceResponse = await fetch(requestEndpoint, {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify(requestBody),
      });

      if(!serviceResponse.ok) {
        const errorBody = await serviceResponse.json();
        console.error('Error from provider:', errorBody);
        return new Response(JSON.stringify(errorBody), { status: serviceResponse.status });
      }

     const data = await serviceResponse.json();
     let retBody;
     if (data.choices && data.choices[0]) { //featherless
       retBody = data.choices[0].text;
     }
     else if(data.candidates && data.candidates[0].content.parts[0]) {//google
       retBody = data.candidates[0].content.parts[0].text;
     }
     const clientResponse = { text: retBody }; 
      //fetch call now unified
      return new Response(JSON.stringify(clientResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json'},
      });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}