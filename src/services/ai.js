
export function buildScenePrompt(promptData, worldState) {
	const location = worldState.locations.find(loc => loc.id === promptData.locationId);
	
	const characters = promptData.characterIds.map(charid => worldState.characters.find(character => character.id === charid));
	
	let prompt = "\n";
	
	prompt += `Location: ${location.name}:`;
	prompt += `${location.narrative.description}\n\n`;
	
	if (characters.length > 0){
		prompt += "Characters in Scene: \n";
		characters.forEach(curChar => {
			prompt += `-- ${curChar.name}: ${curChar.narrative.description}\n`;
			
			if (curChar.narrative.goals.length > 0) {
				prompt += `${curChar.name}s goals: ${curChar.narrative.goals.join(', ')}\n`;
			}
			
			prompt += `${curChar.name}s recent memories: \n`;
			if (curChar.narrative.sceneHistory.length > 0) {
				const recentScenes = curChar.narrative.sceneHistory.slice(-promptData.memoryDepth);
				recentScenes.forEach(scene => {
					const indScene = worldState.scenes.find(s => s.id === scene);
					prompt += `${indScene.narrative.narrationText}\n`;
				});
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
	
	console.log(prompt);
	
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