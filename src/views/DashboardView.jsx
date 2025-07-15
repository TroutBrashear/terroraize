import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import LocationCard from '../components/LocationCard';
import CharacterDisp from '../components/CharacterDisp';
import Poppin from '../components/Poppin';
import CharacterForm from '../components/CharacterForm';
import LocationForm from '../components/LocationForm';


function DashboardView() {
  const locations = useWorldStore((state) => state.locations);
  const characters = useWorldStore((state) => state.characters);

  const [isCharPoppinOpen, setIsCharPoppinOpen] = useState(false);
  const [isLocPoppinOpen, setIsLocPoppinOpen] = useState(false);

  return (
    <div>
      <h1>TerrorAIze</h1>
      <section>
        <h2>Locations</h2>
		<button onClick={() => setIsLocPoppinOpen(true)}>+ Create New Location</button>
        <div>
          {locations.map((loc) => (
            // For each location in the array, render a LocationCard.
            // Pass the location object as a 'location' prop.
            // The 'key' is a special React requirement for lists.
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>
	  <section>
        <h2>Characters</h2>
		<button onClick={() => setIsCharPoppinOpen(true)}>+ Create New Character</button>
        <div>
          {characters.map((char) => (
            <CharacterDisp key={char.id} character={char} />
          ))}
        </div>
      </section>
	  
	  <Poppin isOpen={isCharPoppinOpen} onClose={() => setIsCharPoppinOpen(false)}>
        <CharacterForm onSaveComplete={() => setIsCharPoppinOpen(false)} />
      </Poppin>
	  <Poppin isOpen={isLocPoppinOpen} onClose={() => setIsLocPoppinOpen(false)}>
        <LocationForm onSaveComplete={() => setIsLocPoppinOpen(false)} />
      </Poppin>
    </div>
  );
}

export default DashboardView;