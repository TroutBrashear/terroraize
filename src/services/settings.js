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

export async function fetchKeyStatus() {
	try {
		const response = await fetch('/api/key_status');
		if(!response.ok){
			console.error('API key status failed: ', response.status);
			return false;
		}
		const data = await response.json();
		return data.hasKey;
	}
	catch(error){
			console.error('Failed to fetch API key status: ', error);
	}
}