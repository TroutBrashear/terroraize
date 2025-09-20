import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useModalStore } from '../state/modalStore';
import Poppin from '../components/Poppin';
import SceneForm from '../components/SceneForm';
import styles from './SceneTimeline.module.css';
import { downloadStory } from '../services/export';

function SceneTimeline() { 
	const allScenes = useWorldStore((state) => state.scenes);
	const scenes = useMemo(() => {
		return allScenes.ids.map(id => allScenes.entities[id]).sort((a,b) => { 
			if (a.turn !== b.turn) {
				return a.turn - b.turn;
			}
			return a.id - b.id;
		});
	}, [allScenes]);
	
	const groupByTurn = (scenes) => {
		return scenes.reduce((groupedScenes, scene) => {
			if(!groupedScenes[scene.turn]) {
				groupedScenes[scene.turn] = [];
			}
			
			groupedScenes[scene.turn].push(scene);
			
			return groupedScenes;
		}, {});
	};
	
	const exportStory = () => {
		let formattedStory = '';
		let currentTurn = -1;
		
		scenes.forEach(scene => {
			if(scene.turn !== currentTurn) {
				if(currentTurn !== -1) {
					formattedStory += '\n';
				}
				
				formattedStory += `--- TURN ${scene.turn} ---\n\n`;
				currentTurn = scene.turn;
			}
			
			formattedStory += `${scene.narrative.narrationText} \n\n`;
		});
		
		downloadStory('MyStory.txt', formattedStory);
	};
	
	const scenesByTurn = useMemo(() => groupByTurn(scenes), [scenes]);
	
	const openModal = useModalStore((state) => state.openModal);
	
	return (
		<div>
			<div className={styles.timelineContainer}>
				<button type="button" onClick={exportStory} >Export Story</button>
				{Object.keys(scenesByTurn).map(turnNumber => (
					<div key={turnNumber} className={styles.turnSection}>
						<h4 className={styles.turnMarker}>Turn {turnNumber}</h4>
						<div className={styles.scenesContainer}>
							{scenesByTurn[turnNumber].map(scene => (
								<button key={scene.id} className={`${styles.scenePip} ${scene.resolved ? styles.resolved : ''}`} onClick={() => openModal('scene_form', {scene: scene, locationId: scene.locationId })}>
									{scene.id}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
	
}


export default SceneTimeline;