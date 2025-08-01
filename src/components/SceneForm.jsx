import React, { useState, useEffect } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import styles from './Form.module.css';
import { buildScenePrompt, generateScene } from '../services/ai';

function SceneForm({ scene, locationId, onSaveComplete }) {
	const addScene = useWorldStore((state) => state.addScene);
	const updateScene = useWorldStore((state) => state.updateScene);
	const worldState = useWorldStore.getState();
	
	const { apiKey, modelName } = useSettingStore((state) => state.api);
	
	
	const [isLoading, setIsLoading] = useState(false);
	const [nText, setNText] = useState('');
	const [sLocation, setSLocation] = useState('');
	
	useEffect(() => {
	  if(scene) {
		setNText(scene.narrative.narrationText || '');
		setSLocation(scene.locationId || '');
	  }
	  else {
		setSLocation(locationId);
	  }
	}, [scene]);
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newSceneData = {
			locationId: locationId,
			narrative: {
				narrationText: nText
			}
		};
		if(scene) {
			updateScene(scene.id, newSceneData);
		}	
		else {
			addScene(newSceneData);
		}
		onSaveComplete();
	};
	
	const handleSceneGenerate = async () => {
		setIsLoading(true);
		
		const prompt = buildScenePrompt(sLocation, worldState);
		
		const aiResponse = await generateScene(prompt, apiKey, modelName);
		setNText(aiResponse);
		
		setIsLoading(false);
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className = {styles.formGroup}>
				<label className={styles.label} htmlFor="text">Scene Text </label>
				<textarea className={styles.textarea} type="text" id="name" value={nText} onChange={(e) => setNText(e.target.value)} />
			</div>
			
			<button className={styles.aiButton} type="button" onClick={handleSceneGenerate} disabled={isLoading}> {isLoading ? 'Generating' : 'AI Writer'}</button>
			<button className={styles.submitButton} type="submit">Save Scene</button>
		</form>
	);
}

export default SceneForm;