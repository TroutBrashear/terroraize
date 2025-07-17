import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styles from './Pip.module.css';

function CharPip({ character }) {
	if (!character) {
		return null;
	}
	
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: character.id, // The unique ID for this draggable item
	});
	
	const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  const initial = character.name ? character.name[0]: '?';
  
  return (
    <div ref={setNodeRef} className={styles.pip} style={style} {...listeners} {...attributes}>
      <p className={styles.initial}>{initial}</p>
    </div>
  );
}

export default CharPip;