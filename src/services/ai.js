import { useWorldStore } from '../state/worldStore';

export function buildScenePrompt(promptData) {
	const worldStore = useWorldStore.getState();
	
	const location = worldStore.getLocationById(promptData.locationId);
	
	if(!location) {
		console.error(`Prompted Scene location ${promptData.locationId} not found`);
		throw new Error("Cannot generate scene: Location not found.");
	}
	
	const characters = promptData.characterIds.map(charid => worldStore.getCharacterById(charid));
	
	let prompt = "\n";
	
	prompt += `Location: ${location.name}:`;
	prompt += `${location.narrative.description}\n\n`;
	
	if (characters.length > 0){
		prompt += "Characters in Scene: \n";
		characters.filter(Boolean).forEach(curChar => { 
			prompt += `-- ${curChar.name}: ${curChar.narrative.description}\n`;
			
			if (curChar.narrative.goals.length > 0) {
				prompt += `${curChar.name}s goals: ${curChar.narrative.goals.join(', ')}\n`;
			}
			
			prompt += `${curChar.name}s recent memories: \n`;
			if (curChar.narrative.sceneHistory.length > 0) {
				const recentScenes = curChar.narrative.sceneHistory.slice(-promptData.memoryDepth);
				recentScenes.forEach(scene => {
					const indScene = worldStore.getSceneById(scene);
					if(indScene) {
						prompt += `${indScene.narrative.narrationText}\n`;
					}
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

export async function generateScene(prompt, modelName){
	try {
		const response = await fetch('/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ prompt, modelName }), 
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || 'Failed to generate scene.');
		}

		const data = await response.json();

		if (data.choices && data.choices[0]) {
			return data.choices[0].text;
		} 
		else {
			throw new Error("API response did not contain expected choices.");
		}
	} catch (error) {
		
	}
}


export function buildDirectionPrompt() {
	const worldStore = useWorldStore.getState();
	
	const currentTurn = worldStore.meta.currentTurn;
	
	const locations = worldStore.getAllLocationsAsArray();
    const characters = worldStore.getAllCharactersAsArray();
	const scenes = worldStore.getAllScenesAsArray().filter(scene => scene.turn === (currentTurn-1));

	let prompt = `You are a master storyteller and story director. Your task is to analyze the current state of a fictional world and thoughtfully determine the next logical action and location for each character to drive the narrative forward. You must be logical, creative, and adhere strictly to the requested JSON output format.

	--- WORLD STATE ---

	LOCATIONS:
	${JSON.stringify(locations)}

	CHARACTERS:
	${JSON.stringify(characters)}

	--- EVENTS OF THE LAST TURN (Turn ${currentTurn - 1}) ---
	`;

  // 4. Build the scene summary section.
	if (scenes.length > 0) {
		scenes.forEach((scene, index) => {
		const location = worldStore.getLocationById(scene.locationId);
		
		prompt += `
		SCENE ${index + 1} (Location: ${location ? location.name : 'Unknown'}):
		${scene.narrative.narrationText}
		`;
    });
	} else {
		prompt += `No scenes occurred in the last turn. This is the beginning of the story or a moment of peace.`;
	}

  
	prompt += `

	--- YOUR TASK ---

	Based on the World State and the Events of the Last Turn, for EACH character listed, determine their most logical next location and a brief, compelling "intent" for going there.

	Your response MUST be a single, valid JSON array of objects. Do not include any text or explanation outside of the JSON array.

	Each object in the array must have the following exact structure:
	{
	"characterId": <number>,
	"nextLocationId": <number>,
	"intent": "<string>"
	}

	Example of a valid response:
	[
	{"characterId": 1, "nextLocationId": 1, "intent": "Explore the hidden passage for the amulet."}
	]
	`;
  
  return prompt;
}

export async function generateDirection(modelName){
	const prompt = buildDirectionPrompt();
	
	try {
		const response = await fetch('/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ prompt, modelName }), 
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || 'Failed to generate directions.');
		}

		const data = await response.json();

		if (data.choices && data.choices[0]) {
			const responseString = data.choices[0].text;
			
			try {
				const directions = JSON.parse(responseString);
				return directions;
			} catch(parseError) {
				console.error("Failed to parse AI response (directions) as JSON:", responseText);
				throw new Error("The AI director provided a malformed response.");
			}
		} 
		else {
			throw new Error("API response did not contain expected choices.");
		}
	} catch (error) {
		console.error("Failed to generate AI directions: ",error);
		throw error;
	}
}