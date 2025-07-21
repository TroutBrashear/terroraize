import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import styles from './Form.module.css';

function SceneForm({ scene, locationId, onSaveComplete }) {
	const addScene = useWorldStore((state) => state.addScene);
	
	const [nText, setNText] = useState('');
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newSceneData = {
			locationId: locationId,
			narrative: {
				narrationText: nText
			}
		};
	
		addScene(newSceneData);
		onSaveComplete();
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className = {styles.formGroup}>
				<label className={styles.label} htmlFor="text">Scene Text </label>
				<input className={styles.input} type="text" id="name" value={nText} onChange={(e) => setNText(e.target.value)} />
			</div>
			
			<button className={styles.submitButton} type="submit">Save Scene</button>
		</form>
	);
}

export default SceneForm;