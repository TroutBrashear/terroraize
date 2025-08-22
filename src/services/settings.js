export async function saveApiKey(apiKey) {
  try {
    const response = await fetch('/api/set-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }), 
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Failed to save API key:', error);
    throw error;
  }
}