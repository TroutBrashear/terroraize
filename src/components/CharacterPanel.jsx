import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useModalStore } from '../state/modalStore';
import UnplacedContainer from './UnplacedContainer';
import styles from '../views/DashboardView.module.css';

function CharacterPanel() {
	
	const openModal = useModalStore((state) => state.openModal);
    
	const characters = useWorldStore((state) => state.characters);
	const unplachars = useMemo(() => {
		return characters.ids.map(id => characters.entities[id]).filter(char => char.currentLocationID === null);  
	}, [characters]);
	
	const deleteCharacter = useWorldStore((state) => state.deleteCharacter);

	const characterCount = characters.ids.length;
	
	const handleDeleteCharacter = (character) => {
		if(window.confirm("Confirm Deletion of Character.")){
			deleteCharacter(character.id);
		}
	};
	
	return (
		<div>
			<h2 title={`${characterCount} characters exist.`}>Characters</h2>
			<button onClick={() => openModal('character_form', null)}>+ Create New Character</button>
			<div className="UnplacedDisplay">
				<UnplacedContainer characters={unplachars} onEditClick={(character) => openModal('character_form', character)} onDeleteClick={handleDeleteCharacter}/>
			</div>
		</div>
	);
}

export default CharacterPanel;