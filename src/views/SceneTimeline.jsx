import React, { useState, useMemo } from 'react';
import { useWorldStore } from '../state/worldStore';
import Poppin from '../components/Poppin';
import SceneForm from '../components/SceneForm';
import styles from './SceneTimeline.module.css';

function SceneTimeline() {
	const scenes = useWorldStore((state) => state.scenes);
	const [selectedScene, setSelectedScene] = useState(null);
	
	return (
		<div className={styles.timelineContainer}>
			<div className={styles.scenesContainer}>
				{scenes.map(scene => (
					<button key={scene.id} className={styles.scenePip} onClick={() => setSelectedScene(scene)}>
						{scene.id}
					</button>
				))}
			</div>
			
			<Poppin isOpen={!!selectedScene} onClose={() => setSelectedScene(null)}>
				<SceneForm scene={selectedScene} onSaveComplete={() => {setSelectedScene(null);}}/>
			</Poppin>
		</div>
	);
}


export default SceneTimeline;