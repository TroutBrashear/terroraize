

export async function generateScene(prompt, apiKey, modelName){
	const apiUrl = "https://api.featherless.ai/v1/completions";
	cont headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${apiKey}`
	};
	
	const body = {
		model: modelName,
		prompt: prompt,
		max_tokens: 1500,
		temperature: 0.7,
	};
	
	
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});
		
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`API Error: ${response.status} - ${errorData.error.message || JSON.stringify(errorData)}`);
		}
		
		const data = await response.json();
		
		
		if(data.choices && data.choices[0]) {
			return data.choices[0].text;
		}else{
			throw new Error("API did not return choices.");
		}
	} catch (error) {
		console.error("Scene Generation Failed. ", error);
		return `Error: Could not generate scene. Details: ${error.message}`;
	}
}