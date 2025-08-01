
export function buildScenePrompt(locationId, worldState) {
	const location = worldState.locations.find(loc => loc.id === locationId);
	
	const characters = worldState.characters.filter(char => char.currentLocationID === locationId);
	
	let prompt = "You are a writer. Please write a story scene based on the following details: \n\n";
	
	prompt += `Location: ${location.name}:`;
	prompt += `${location.narrative.description}\n\n`;
	
	if (characters.length > 0){
		prompt += "Characters in Scene: \n";
		characters.forEach(char => {
			prompt += `-- ${char.name}: ${char.narrative.description}\n`;
			
			if (char.narrative.goals.length > 0) {
				prompt += `${char.name}s goals: ${char.narrative.goals.join(', ')}\n`;
			}
		});
		prompt += '\n';
	}
	else {
		prompt += "No characters in scene. \n";
	}
	
	
	return prompt;
}

export async function generateScene(prompt, apiKey, modelName){
	const apiUrl = "/api/completions";
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${apiKey}`,
		'HTTP-Referer': 'http://localhost:5173', 
		'X-Title': 'terroraize' 
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
			console.error(errorData);
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