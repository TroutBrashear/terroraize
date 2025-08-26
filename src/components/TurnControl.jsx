import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import { buildScenePrompt, generateScene } from '../services/ai';

function TurnControl({openTurnSettings}) {
  const worldState = useWorldStore.getState();
  const currentTurn = useWorldStore((state) => state.meta.currentTurn);
  const advTurn = useWorldStore((state) => state.advTurn);
  const getUnresolvedScenes = useWorldStore((state) => state.getUnresolvedScenes);
  const manageSceneResolution = useWorldStore((state) => state.manageSceneResolution);
  const updateScene = useWorldStore((state) => state.updateScene);
  const [turnResolution, setTurnResolution] = useState(false); //is a turn actively being resolved? If so, some functionality is disabled to wait for AI services
  const { key, modelName } = useSettingStore((state) => state.writerSettings.api);
  const { text, memoryDepth }= useSettingStore((state) => state.writerSettings.prompt);
  
  const atmosphere = useSettingStore((state) => state.writerSettings.atmosphere.text);
  const resetAtmo = useSettingStore((state) => state.writerSettings.atmosphere.resetEachTurn);
  const updateAtmoSettings = useSettingStore((state) => state.setAtmoSettings);
  
	const resTurn =  async () => {
	setTurnResolution(true);
	  
	const unresScenes = getUnresolvedScenes(currentTurn);
	  
	if(unresScenes.length === 0) {
		advTurn();
		if(resetAtmo) {
			const newAtmoSettings = {
				text: '',
				resetEachTurn: true,	
			};
		
			updateAtmoSettings(newAtmoSettings);
		}
		
		setTurnResolution(false);
		return;
	}
	  
	for(const scen of unresScenes) {
		const promptData = {locationId: scen.locationId, characterIds: scen.narrative.charactersPresent, memoryDepth: memoryDepth };
		
		const prompt = text + atmosphere + buildScenePrompt(promptData);
		
		const output = await generateScene(prompt, key, modelName);
		
		updateScene(scen.id, { narrative: { narrationText: output }, resolved: true });
		manageSceneResolution(scen);
	}
	if(resetAtmo) {
		const newAtmoSettings = {
			text: '',
			resetEachTurn: true,	
		};
		
		updateAtmoSettings(newAtmoSettings);
	}
	advTurn();
	setTurnResolution(false);
  };
	
	
  return (
	<div className="turn-control"> 
	  <h1>{currentTurn}</h1>
	  <button onClick={() => resTurn()}> Advance Turn </button>
	  <button onClick={openTurnSettings}> Turn Settings </button>
	</div>
  );
}

export default TurnControl;