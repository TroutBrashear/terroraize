import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import LocationCard from '../components/LocationCard';
import CharacterDisp from '../components/CharacterDisp';
import Poppin from '../components/Poppin';
import CharacterForm from '../components/CharacterForm';
import LocationForm from '../components/LocationForm';
import UnplacedContainer from '../components/UnplacedContainer';
import styles from './DashboardView.module.css';
import { DndContext, useDroppable } from '@dnd-kit/core';

function DashboardView() {
  const locations = useWorldStore((state) => state.locations);
  const characters = useWorldStore((state) => state.characters);
  
  const unplachars = characters.filter(char => char.currentLocationID === null);

  const [isCharPoppinOpen, setIsCharPoppinOpen] = useState(false);
  const [isLocPoppinOpen, setIsLocPoppinOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState(null);
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

  const openEditor = (characterb) => {
	setIsCharPoppinOpen(true);
	setCharacterToEdit(characterb);
  };

  return (
	<DndContext onDragEnd={handleDragEnd}>
    <div>
      <h1>TerrorAIze</h1>
      <section>
        <h2>Locations</h2>
		<button onClick={() => setIsLocPoppinOpen(true)}>+ Create New Location</button>
        <div className={styles.dispContainer}>
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>
	  <section>
        <h2>Characters</h2>
		<button onClick={() => setIsCharPoppinOpen(true)}>+ Create New Character</button>
        <div className="UnplacedDisplay">
          <UnplacedContainer characters={unplachars} onEditClick={openEditor}/>
        </div>
      </section>
	  
	  <Poppin isOpen={isCharPoppinOpen} onClose={() => setIsCharPoppinOpen(false)}>
        <CharacterForm characterToEdit={characterToEdit} onSaveComplete={() => {setIsCharPoppinOpen(false); setCharacterToEdit(null);}} />
      </Poppin>
	  <Poppin isOpen={isLocPoppinOpen} onClose={() => setIsLocPoppinOpen(false)}>
        <LocationForm onSaveComplete={() => setIsLocPoppinOpen(false)} />
      </Poppin>
    </div>
	</DndContext>
  );
}

export default DashboardView;