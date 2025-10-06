import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useModalStore } from '../state/modalStore';
import LocationCard from './LocationCard';
import styles from './Panel.module.css';

function LocationPanel() {
	
	const openModal = useModalStore((state) => state.openModal);
    
	const allLocations = useWorldStore((state) => state.locations);
	const locations = useMemo(() => {
	  return allLocations.ids.map(id => allLocations.entities[id]);
	}, [allLocations]);
	
	const deleteLocation = useWorldStore.getState().deleteLocation;
 	
 	const locationCount = allLocations.ids.length;
	
	return (
		<div className={styles.panel}>
			<h2 title={`${locationCount} locations exist.`}>Locations</h2>
			<button onClick={() => openModal('location_form', null)}>+ Create New Location</button>
			<div className={styles.cardList}>
				{locations.map((loc) => (
					<LocationCard key={loc.id} location={loc} onEditClick={() => openModal('location_form', loc)} onDeleteClick={() => openModal('confirm_modal', {message: `Are you sure you want to delete "${loc.name}"?`, onConfirm: () => deleteLocation(loc.id)})} onSceneClick={() => openModal('scene_form', {scene: null, locationId: loc.id})}/>
				))}
			</div>
		</div>
	);
}

export default LocationPanel;