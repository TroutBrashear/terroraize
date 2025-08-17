import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import { buildScenePrompt, generateScene } from '../services/ai';

function TurnControl() {
  const worldState = useWorldStore.getState();
  const currentTurn = useWorldStore((state) => state.meta.currentTurn);
  const advTurn = useWorldStore((state) => state.advTurn);
  const getUnresolvedScenes = useWorldStore((state) => state.getUnresolvedScenes);
  const updateScene = useWorldStore((state) => state.updateScene);
  const [turnResolution, setTurnResolution] = useState(false); //is a turn actively being resolved? If so, some functionality is disabled to wait for AI services
  const { key, modelName } = useSettingStore((state) => state.writerSettings.api);
  const promptText = useSettingStore((state) => state.writerSettings.prompt.text);
	
	const resTurn =  async () => {
	setTurnResolution(true);
	  
	const unresScenes = getUnresolvedScenes(currentTurn);
	  
	if(unresScenes.length === 0) {
		advTurn();
		return;
	}
	  
	for(const scen of unresScenes) {
		const promptData = {locationId: scen.locationId, characterIds: scen.narrative.presentCharacters };
		
		const prompt = promptText + buildScenePrompt(promptData, worldState);
		
		const output = await generateScene(prompt, key, modelName);
		
		updateScene(scen.id, { narrative: { narrationText: output }, resolved: true });
	}		
	advTurn();
	setTurnResolution(false);
  };
	
	
  return (
	<div className="turn-control"> 
	  <h1>{currentTurn}</h1>
	  <button onClick={() => resTurn()}> Advance Turn </button>
	</div>
  );
}

export default TurnControl;