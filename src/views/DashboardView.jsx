import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import { useModalStore } from '../state/modalStore';
import LocationCard from '../components/LocationCard';
import CharacterDisp from '../components/CharacterDisp';
import Poppin from '../components/Poppin';
import UnplacedContainer from '../components/UnplacedContainer';
import styles from './DashboardView.module.css';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { buildScenePrompt, generateScene } from '../services/ai';
import TurnControl from '../components/TurnControl';

function DashboardView() {
  const currentTurn = useWorldStore((state) => state.meta.currentTurn);
	
  const allLocations = useWorldStore((state) => state.locations);
  const locations = useMemo(() => {
	  return allLocations.ids.map(id => allLocations.entities[id]);
  }, [allLocations]);
  
  const characters = useWorldStore((state) => state.characters);
  const unplachars = useMemo(() => {
	return characters.ids.map(id => characters.entities[id]).filter(char => char.currentLocationID === null);  
	}, [characters]);
  
  const openModal = useModalStore((state) => state.openModal);
  
  const moveCharacter = useWorldStore((state) => state.moveCharacter);
  const deleteCharacter = useWorldStore((state) => state.deleteCharacter);
  const deleteLocation = useWorldStore((state) => state.deleteLocation);
  const advTurn = useWorldStore((state) => state.advTurn);
  const getUnresolvedScenes = useWorldStore((state) => state.getUnresolvedScenes);
  const updateScene = useWorldStore((state) => state.updateScene);

  const [turnResolution, setTurnResolution] = useState(false); //is a turn actively being resolved? If so, some functionality is disabled to wait for AI services
  const { key, modelName } = useSettingStore((state) => state.writerSettings.api);
  const promptText = useSettingStore((state) => state.writerSettings.prompt.text);

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
  
  const handleDeleteCharacter = (character) => {
	if(window.confirm("Confirm Deletion of Character.")){
	  deleteCharacter(character.id);
	}
  };
  const handleDeleteLocation = (location) => {
	if(window.confirm("Confirm Deletion of Location.")){
	  deleteLocation(location.id);
	}
  };
  
  return (
	<DndContext onDragEnd={handleDragEnd}>
    <div>
	  <button onClick={() => openModal('writer_settings_form')}>AI Settings</button>
	  <TurnControl openTurnSettings={() => openModal('turn_settings_form')}/>
      <section>
        <h2>Locations</h2>
		<button onClick={() => openModal('location_form', null)}>+ Create New Location</button>
        <div className={styles.dispContainer}>
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} onEditClick={() => openModal('location_form', loc)} onDeleteClick={handleDeleteLocation} onSceneClick={() => openModal('scene_form', loc.id)}/>
          ))}
        </div>
      </section>
	  <section>
        <h2>Characters</h2>
		<button onClick={() => openModal('character_form', null)}>+ Create New Character</button>
        <div className="UnplacedDisplay">
          <UnplacedContainer characters={unplachars} onEditClick={(character) => openModal('character_form', character)} onDeleteClick={handleDeleteCharacter}/>
        </div>
      </section>
	</div>
	</DndContext>
  );
}

export default DashboardView;