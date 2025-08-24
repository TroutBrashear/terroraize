import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import LocationCard from '../components/LocationCard';
import CharacterDisp from '../components/CharacterDisp';
import Poppin from '../components/Poppin';
import UnplacedContainer from '../components/UnplacedContainer';
import styles from './DashboardView.module.css';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { buildScenePrompt, generateScene } from '../services/ai';
import TurnControl from '../components/TurnControl';
import PoppinManager from '../components/managers/PoppinManager';

function DashboardView() {
  const locations = useWorldStore((state) => state.locations);
  const characters = useWorldStore((state) => state.characters);
  const currentTurn = useWorldStore((state) => state.meta.currentTurn);
  const worldState = useWorldStore.getState();
  const unplachars = characters.filter(char => char.currentLocationID === null);
  
  const [openPoppin, setOpenPoppin] = useState(null);
  const [poppinData, setPoppinData] = useState(null);
  
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

  const openCharEditor = (characterb) => {
	setOpenPoppin('character_form');
	setPoppinData(characterb);
  }; 
  const openLocEditor = (locationb) => {
	setOpenPoppin('location_form');
	setPoppinData(locationb);
	
  };
  const addScene = (locationId) => {
	setOpenPoppin('scene_form');
	setPoppinData(locationId);
  };
  const openWriterSettings = () => {
	setOpenPoppin('writer_settings_form');
	setPoppinData('');
  };
  const openTurnSettings = () => {
	setOpenPoppin('turn_settings_form');
	setPoppinData('');
  };
  const closePoppin = () => {
	setOpenPoppin(null);
	setPoppinData(null);
  };
  
  return (
	<DndContext onDragEnd={handleDragEnd}>
    <div>
	  <button onClick={() => openWriterSettings()}>AI Settings</button>
	  <TurnControl openTurnSettings={openTurnSettings}/>
      <section>
        <h2>Locations</h2>
		<button onClick={() => openLocEditor(null)}>+ Create New Location</button>
        <div className={styles.dispContainer}>
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} onEditClick={openLocEditor} onDeleteClick={handleDeleteLocation} onSceneClick={addScene}/>
          ))}
        </div>
      </section>
	  <section>
        <h2>Characters</h2>
		<button onClick={() => openCharEditor(null)}>+ Create New Character</button>
        <div className="UnplacedDisplay">
          <UnplacedContainer characters={unplachars} onEditClick={openCharEditor} onDeleteClick={handleDeleteCharacter}/>
        </div>
      </section>
	  
	  <PoppinManager poppinType={openPoppin} data={poppinData} onClose={closePoppin}/>
	</div>
	</DndContext>
  );
}

export default DashboardView;