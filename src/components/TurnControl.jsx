import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import { useModalStore } from '../state/modalStore';
import { buildScenePrompt, generateScene } from '../services/ai';

function TurnControl({openTurnSettings}) {
  const worldState = useWorldStore.getState();
  const currentTurn = useWorldStore((state) => state.meta.currentTurn);
  const openModal = useModalStore((state) => state.openModal);
  const advTurn = useWorldStore((state) => state.advTurn);
  const resolveTurn = useWorldStore((state) => state.resolveTurn);
  const [turnResolution, setTurnResolution] = useState(false); //is a turn actively being resolved? If so, some functionality is disabled to wait for AI services
  
	const resTurn =  async () => {
		setTurnResolution(true);
		await resolveTurn();
		openModal('turn_debrief_modal');
		//advTurn(); //removed, this occurs in TurnDebrief now.
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