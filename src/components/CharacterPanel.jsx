import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useModalStore } from '../state/modalStore';
import UnplacedContainer from './UnplacedContainer';
import styles from './Panel.module.css';

function CharacterPanel() {
	
	const openModal = useModalStore((state) => state.openModal);
    
	const characters = useWorldStore((state) => state.characters);
	const unplachars = useMemo(() => {
		return characters.ids.map(id => characters.entities[id]).filter(char => char.currentLocationID === null);  
	}, [characters]);
	
	const deleteCharacter = useWorldStore.getState().deleteCharacter;

	const characterCount = characters.ids.length;
	
	return (
		<div className={styles.panel}>
			<h2 title={`${characterCount} characters exist.`}>Characters</h2>
			<button onClick={() => openModal('character_form', null)}>+ Create New Character</button>
			<h2>Unassigned Characters</h2>
			<div className={styles.cardList}>
				<UnplacedContainer characters={unplachars} onEditClick={(character) => openModal('character_form', character)} onDeleteClick={(character) => openModal('confirm_modal', {message: `Are you sure you want to delete "${character.name}"?`, onConfirm: () => deleteCharacter(character.id)} )}/>
			</div>
		</div>
	);
}

export default CharacterPanel;