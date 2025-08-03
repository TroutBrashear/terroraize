import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import DispDropdown from './DispDropdown';
import styles from './CharacterDisp.module.css';


function CharacterDisp({ character, onEditClick, onDeleteClick }) {
	 if (!character) {
    return null;
  }
	
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: character.id, // The unique ID for this draggable item
	});
	
	const color = character.presentation?.color || '#555555';
	
	const style = transform ? { 
		backgroundColor: color,
		transform: `translate3d(${transform.x}px, ${transform.y}px,0)`,
		zIndex:999,
		} 
		: {
		backgroundColor: color,
	};

	
  return (
    <div ref={setNodeRef} className={styles.card} style={style}>
	  <div className={styles.cardHeader}{...listeners} {...attributes}>
        <h3 className={styles.name}>{character.name}</h3>
		<p className={styles.description}>{character.narrative.description}</p>
      </div>
	  <DispDropdown>
		<button className={styles.menuitem} onClick={() => onEditClick(character)}> Edit </button>
		<button className={styles.menuitem} onClick={() => onDeleteClick(character)}> Delete </button>
	  </DispDropdown>
      
    </div>
  );
}

export default CharacterDisp;