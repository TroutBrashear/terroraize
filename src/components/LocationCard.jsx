import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import DispDropdown from './DispDropdown';
import styles from './LocationCard.module.css';
import { useWorldStore } from '../state/worldStore';
import CharPip from './CharPip';

function LocationCard({ location, onEditClick, onDeleteClick, onSceneClick }) {
  if (!location) {
    return null;
  }
  
  const { isOver, setNodeRef } = useDroppable({
    id: location.id, // The unique ID for this droppable area
  });
 
  const style = {
    backgroundColor: isOver ? '#3e3e3e' : '#2a2a2a',
  };
 
 const chars = useWorldStore((state) => state.characters);
 const charsHere = chars.filter(char => char.currentLocationID === location.id);
 
 
 return (
	<div ref={setNodeRef} className={styles.card} style={style}>
      <h3 className={styles.name}>{location.name}</h3>
      <p className={styles.description}>{location.narrative.description}</p>
	  <div className={styles.pipContainer}>
		{charsHere.map((char) => (
		<CharPip key={char.id} character={char}/>
		))}
	  </div>
	  <DispDropdown>
		<button className={styles.menuitem} onClick={() => onEditClick(location)}> Edit </button>
		<button className={styles.menuitem} onClick={() => onDeleteClick(location)}> Delete </button>
		<button className={styles.menuitem} onClick={() => onSceneClick(location.id)}> Create Scene </button>
	  </DispDropdown>
	</div>
  );
}

export default LocationCard;