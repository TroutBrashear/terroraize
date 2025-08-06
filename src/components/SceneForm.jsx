import React, { useState, useEffect } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import styles from './Form.module.css';
import { buildScenePrompt, generateScene } from '../services/ai';

function SceneForm({ scene, locationId, onSaveComplete }) {
	const addScene = useWorldStore((state) => state.addScene);
	const updateScene = useWorldStore((state) => state.updateScene);
	const worldState = useWorldStore.getState();
	
	const { key, modelName } = useSettingStore((state) => state.writerSettings.api);
	const { text } = useSettingStore((state) => state.writerSettings.prompt);
	
	const [isLoading, setIsLoading] = useState(false);
	const [nText, setNText] = useState('');
	const [sLocation, setSLocation] = useState('');
	const [resolved, setResolved] = useState(false);
	
	useEffect(() => {
	  if(scene) {
		setNText(scene.narrative.narrationText || '');
		setSLocation(scene.locationId || '');
		setResolved(scene.resolved || false);
	  }
	  else {
		setSLocation(locationId);
	  }
	}, [scene]);
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newSceneData = {
			locationId: sLocation,
			resolved: resolved,
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
		
		const prompt = text + buildScenePrompt(sLocation, worldState);
		
		const aiResponse = await generateScene(prompt, key, modelName);
		setNText(aiResponse);
		
		setResolved(true);
		
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