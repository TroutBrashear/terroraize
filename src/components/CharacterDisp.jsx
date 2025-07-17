import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styles from './CharacterDisp.module.css';


function CharacterDisp({ character }) {
	 if (!character) {
    return null;
  }
	
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: character.id, // The unique ID for this draggable item
	});
	
	const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <div ref={setNodeRef} className={styles.card} style={style} {...listeners} {...attributes}>
      <h3 className={styles.name}>{character.name}</h3>
      <p className={styles.description}>{character.narrative.description}</p>
    </div>
  );
}

export default CharacterDisp;