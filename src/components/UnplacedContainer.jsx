import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useWorldStore } from '../state/worldStore';
import CharacterDisp from './CharacterDisp';
import styles from './Panel.module.css';

function UnplacedContainer({ characters, onEditClick, onDeleteClick }) {
	
 const { isOver, setNodeRef } = useDroppable({
    id: 'unplaced', // null droppable
  });
  
  const style = {
    // Give visual feedback when a character is dragged over it
    backgroundColor: isOver ? '#223322' : '#1e1e1e',
    padding: '1rem',
    minHeight: '100px', // So it has a drop area even when empty
    border: '2px dashed #444',
    borderRadius: '8px',
  };
  
   return (
    // Attach the setNodeRef here to make the whole container droppable
    <div ref={setNodeRef} style={style}>
        {characters.map(char => (
          <CharacterDisp key={char.id} character={char} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
        ))}
    </div>
  ); 
}


export default UnplacedContainer;