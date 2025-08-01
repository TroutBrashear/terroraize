import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import Poppin from '../components/Poppin';
import SceneForm from '../components/SceneForm';
import styles from './SceneTimeline.module.css';

function SceneTimeline() {
	const scenes = useWorldStore((state) => state.scenes);
	const [selectedScene, setSelectedScene] = useState(null);
	
	const groupByTurn = (scenes) => {
		return scenes.reduce((groupedScenes, scene) => {
			if(!groupedScenes[scene.turn]) {
				groupedScenes[scene.turn] = [];
			}
			
			groupedScenes[scene.turn].push(scene);
			
			return groupedScenes;
		}, {});
	};
	
	const scenesByTurn = useMemo(() => groupByTurn(scenes), [scenes]);
	
	return (
		<div className={styles.timelineContainer}>
			{Object.keys(scenesByTurn).map(turnNumber => (
				<div key={turnNumber} className={styles.turnSection}>
					<h4 className={styles.turnMarker}>Turn {turnNumber}</h4>
					<div className={styles.scenesContainer}>
						{scenesByTurn[turnNumber].map(scene => (
							<button key={scene.id} className={styles.scenePip} onClick={() => setSelectedScene(scene)}>
								{scene.id}
							</button>
						))}
					</div>
				</div>
			))}
			
			<Poppin isOpen={!!selectedScene} onClose={() => setSelectedScene(null)}>
				<SceneForm scene={selectedScene} onSaveComplete={() => {setSelectedScene(null);}}/>
			</Poppin>
		</div>
	);
}


export default SceneTimeline;