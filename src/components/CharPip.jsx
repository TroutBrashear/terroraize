import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styles from './Pip.module.css';
import {textColor} from '../services/visuals.js';

function CharPip({ character, isReadOnly }) {
	if (!character) {
		return null;
	}
	
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: character.id, // The unique ID for this draggable item
		disabled: isReadOnly,
	});
	
	  const initial = character.name ? character.name[0].toUpperCase(): '?';
	const color = character.presentation?.color || '#555555';
	
	const style = transform ? { 
		backgroundColor: color,
		transform: `translate3d(${transform.x}px, ${transform.y}px,0)`,
		zIndex:999,
		} 
		: {
		backgroundColor: color,
	};
	
	const initialStyle = {
		color: textColor(color),
	};
  
  return (
    <div ref={setNodeRef} className={styles.pip} style={style} title={character.name} {...(!isReadOnly ? listeners: null)} {...(!isReadOnly ? attributes : null)}>
      <p className={styles.initial} style={initialStyle}>{initial}</p>
    </div>
  );
}

export default CharPip;