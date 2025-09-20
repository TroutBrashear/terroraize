import React from 'react';
import { useWorldStore } from '../state/worldStore';
import { useModalStore } from '../state/modalStore';
import LocationPanel from '../components/LocationPanel';
import CharacterPanel from '../components/CharacterPanel';
import styles from './DashboardView.module.css';
import { DndContext } from '@dnd-kit/core';
import TurnControl from '../components/TurnControl';

function DashboardView() {
  const openModal = useModalStore((state) => state.openModal);
  
  const moveCharacter = useWorldStore((state) => state.moveCharacter);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const characterId = active.id;
      const locationId = over.id;
	  if (locationId === 'unplaced'){
		moveCharacter(characterId, null);
	  }
	  else {
		moveCharacter(characterId, locationId);
	  }
    }
  };
  
  return (
	<DndContext onDragEnd={handleDragEnd}>
		<div>
			<button onClick={() => openModal('writer_settings_form')}>AI Settings</button>
			<TurnControl openTurnSettings={() => openModal('turn_settings_form')}/>
		</div>
		<div className={styles.dispContainer}>
			<LocationPanel />
			<CharacterPanel />
		</div>
	</DndContext>
  );
}

export default DashboardView;