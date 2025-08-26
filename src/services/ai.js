import { useWorldStore } from '../state/worldStore';

export function buildScenePrompt(promptData) {
	const worldStore = useWorldStore.getState();
	
	const location = worldStore.locations.find(loc => loc.id === promptData.locationId);
	
	const characters = promptData.characterIds.map(charid => worldStore.getCharacterById(charid));
	
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
					const indScene = worldStore.scenes.find(s => s.id === scene);
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
		console.error("Scene Generation Failed. ", error);
		throw error;
	}
}