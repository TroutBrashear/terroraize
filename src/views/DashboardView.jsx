import React from 'react';
import { useWorldStore } from '../state/worldStore'; // Go up one level, then into 'state'
import LocationCard from '../components/LocationCard'; // Go up one level, then into 'components'
import CharacterDisp from '../components/CharacterDisp'; // Go up one level, then into 'components'

function DashboardView() {
  const locations = useWorldStore((state) => state.locations);
  const characters = useWorldStore((state) => state.characters);

  return (
    <div>
      <h1>TerrorAIze</h1>
      <section>
        <h2>Locations</h2>
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
        <div>
          {characters.map((char) => (
            <CharacterDisp key={char.id} character={char} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardView;