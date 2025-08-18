import React, { useState, useEffect } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import styles from './Form.module.css';
import { buildScenePrompt, generateScene } from '../services/ai';

function SceneForm({ scene, locationId, onSaveComplete }) {
	const addScene = useWorldStore((state) => state.addScene);
	const updateScene = useWorldStore((state) => state.updateScene);
	const worldState = useWorldStore.getState();
	const manageSceneResolution = useWorldStore((state) => state.manageSceneResolution);
	
	const { key, modelName } = useSettingStore((state) => state.writerSettings.api);
	const { text, memoryDepth } = useSettingStore((state) => state.writerSettings.prompt);
	
	const [isLoading, setIsLoading] = useState(false);
	const [nText, setNText] = useState('');
	const [sLocation, setSLocation] = useState('');
	const [resolved, setResolved] = useState(false);
	const [presentCharacters, setPresentCharacters] = useState([]);
	
	useEffect(() => {
	  if(scene) {
		setNText(scene.narrative.narrationText || '');
		setSLocation(scene.locationId || '');
		setResolved(scene.resolved || false);
		setPresentCharacters(scene.narrative.presentCharacters || []);
	  }
	  else {
		setSLocation(locationId);
		const charsHere = worldState.characters.filter(char => char.currentLocationID === locationId);
		const charIds = charsHere.map(char => char.id);
		setPresentCharacters(charIds);
	  }
	}, [scene]);
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newSceneData = {
			locationId: sLocation,
			resolved: resolved,
			narrative: {
				narrationText: nText,
				charactersPresent: presentCharacters
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
		const promptData = {locationId: sLocation, characterIds: presentCharacters, memoryDepth: memoryDepth };
		const prompt = text + buildScenePrompt(promptData, worldState);
		
		const aiResponse = await generateScene(prompt, key, modelName);
		setNText(aiResponse);
		
		setResolved(true);
		manageSceneResolution(scene);
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