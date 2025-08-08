import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import LocationCard from '../components/LocationCard';
import CharacterDisp from '../components/CharacterDisp';
import Poppin from '../components/Poppin';
import CharacterForm from '../components/CharacterForm';
import LocationForm from '../components/LocationForm';
import SceneForm from '../components/SceneForm';
import WriterSettingsForm from '../components/WriterSettingsForm';
import UnplacedContainer from '../components/UnplacedContainer';
import styles from './DashboardView.module.css';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { buildScenePrompt, generateScene } from '../services/ai';


function DashboardView() {
  const locations = useWorldStore((state) => state.locations);
  const characters = useWorldStore((state) => state.characters);
  const currentTurn = useWorldStore((state) => state.meta.currentTurn);
  const worldState = useWorldStore.getState();
  const unplachars = characters.filter(char => char.currentLocationID === null);

  const [isCharPoppinOpen, setIsCharPoppinOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState(null);
  const [isLocPoppinOpen, setIsLocPoppinOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [isScenePoppinOpen, setIsScenePoppinOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [isWSettingsPoppinOpen, setIsWSettingsPoppinOpen] = useState(false);
  
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

  const openEditor = (characterb) => {
	setIsCharPoppinOpen(true);
	setCharacterToEdit(characterb);
  }; 
  const openLocEditor = (locationb) => {
	setIsLocPoppinOpen(true);
	setLocationToEdit(locationb);
  };
  
  const addScene = (locationId) => {
	setIsScenePoppinOpen(true);
	setSelectedScene(null);
	setLocationToEdit(locationId);
  };
  
  
  const resTurn =  async () => {
	setTurnResolution(true);
	  
	const unresScenes = getUnresolvedScenes(currentTurn);
	  
	if(unresScenes.length === 0) {
		advTurn();
		return;
	}
	  
	for(const scen of unresScenes) {
		const prompt = promptText + buildScenePrompt(scen.locationId, worldState);
		
		const output = await generateScene(prompt, key, modelName);
		
		updateScene(scen.id, { narrative: { narrationText: output }, resolved: true });
	}		
	advTurn();
	setTurnResolution(false);
  };
  
  
  
  return (
	<DndContext onDragEnd={handleDragEnd}>
    <div>
	  <button onClick={() => setIsWSettingsPoppinOpen(true)}>AI Settings</button>
	  <div className={styles.headerContainer}>
        <h1>{currentTurn}</h1>
		<button onClick={() => resTurn()}> Advance Turn </button>
      </div>
      <section>
        <h2>Locations</h2>
		<button onClick={() => setIsLocPoppinOpen(true)}>+ Create New Location</button>
        <div className={styles.dispContainer}>
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} onEditClick={openLocEditor} onDeleteClick={handleDeleteLocation} onSceneClick={addScene}/>
          ))}
        </div>
      </section>
	  <section>
        <h2>Characters</h2>
		<button onClick={() => setIsCharPoppinOpen(true)}>+ Create New Character</button>
        <div className="UnplacedDisplay">
          <UnplacedContainer characters={unplachars} onEditClick={openEditor} onDeleteClick={handleDeleteCharacter}/>
        </div>
      </section>
	  
	  
	  <Poppin isOpen={isCharPoppinOpen} onClose={() => setIsCharPoppinOpen(false)}>
        <CharacterForm characterToEdit={characterToEdit} onSaveComplete={() => {setIsCharPoppinOpen(false); setCharacterToEdit(null);}} />
      </Poppin>
	  <Poppin isOpen={isLocPoppinOpen} onClose={() => setIsLocPoppinOpen(false)}>
        <LocationForm locationToEdit={locationToEdit} onSaveComplete={() => {setIsLocPoppinOpen(false); setLocationToEdit(null);}} />
      </Poppin>
	  <Poppin isOpen={isScenePoppinOpen} onClose={() => setIsScenePoppinOpen(false)}>
		<SceneForm scene={selectedScene} locationId={locationToEdit} onSaveComplete={() => {setIsScenePoppinOpen(false); setLocationToEdit(null);}}/>
	  </Poppin>
	  <Poppin isOpen={isWSettingsPoppinOpen} onClose={() => setIsWSettingsPoppinOpen(false)}>
		<WriterSettingsForm onSaveComplete={() => {setIsWSettingsPoppinOpen(false);}}/>
	  </Poppin>
    </div>
	</DndContext>
  );
}

export default DashboardView;