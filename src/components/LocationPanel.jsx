import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useModalStore } from '../state/modalStore';
import LocationCard from './LocationCard';
import styles from '../views/DashboardView.module.css';

function LocationPanel() {
	
	const openModal = useModalStore((state) => state.openModal);
    
	const allLocations = useWorldStore((state) => state.locations);
	const locations = useMemo(() => {
	  return allLocations.ids.map(id => allLocations.entities[id]);
	}, [allLocations]);
	
	const deleteLocation = useWorldStore((state) => state.deleteLocation);
 
	
	const handleDeleteLocation = (location) => {
		if(window.confirm("Confirm Deletion of Location.")){
			deleteLocation(location.id);
		}
	};
	
	return (
		<div>
			<h2>Locations</h2>
			<button onClick={() => openModal('location_form', null)}>+ Create New Location</button>
			<div className={styles.dispContainer}>
				{locations.map((loc) => (
					<LocationCard key={loc.id} location={loc} onEditClick={() => openModal('location_form', loc)} onDeleteClick={handleDeleteLocation} onSceneClick={() => openModal('scene_form', {scene: null, locationId: loc.id})}/>
				))}
			</div>
		</div>
	);
}

export default LocationPanel;