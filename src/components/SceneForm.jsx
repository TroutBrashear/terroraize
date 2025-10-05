import React, { useState, useEffect } from 'react';
import { useWorldStore } from '../state/worldStore';
import { useSettingStore } from '../state/settingStore';
import { useNotificationStore } from '../state/notificationStore';
import styles from './Form.module.css';
import { buildScenePrompt, generateScene } from '../services/ai';
import LocationCard from './LocationCard';

function SceneForm({ scene, locationId, onSaveComplete }) {
	const addScene = useWorldStore((state) => state.addScene);
	const updateScene = useWorldStore((state) => state.updateScene);
	const getLocationById = useWorldStore((state) => state.getLocationById);
	const manageSceneResolution = useWorldStore((state) => state.manageSceneResolution);
	
	const { modelName, provider } = useSettingStore((state) => state.writerSettings.api);
	const { text, memoryDepth } = useSettingStore((state) => state.writerSettings.prompt);
	const atmosphere = useSettingStore((state) => state.writerSettings.atmosphere.text);
	
	const [isLoading, setIsLoading] = useState(false);
	const [nText, setNText] = useState('');
	const [sLocation, setSLocation] = useState('');
	const [resolved, setResolved] = useState(false);
	
	const characters = useWorldStore((state) => state.characters);
	const [presentCharacters, setPresentCharacters] = useState([]);
	const [location, setLocation] = useState(null);

	const { showNotification } = useNotificationStore.getState();

	const [error, setError] = useState(null);
	
	useEffect(() => {
	  
	  if(scene) {
		setNText(scene.narrative.narrationText || '');
		setSLocation(scene.locationId || '');
		if(scene.locationId)
		{
			setLocation(getLocationById(scene.locationId));
		}
		setResolved(scene.resolved || false);
		setPresentCharacters(scene.narrative.presentCharacters || []);
	  }
	  else {
		setSLocation(locationId);
		setLocation(getLocationById(locationId));
		const charsHere = characters.ids.map(id => characters.entities[id]).filter(char => char.currentLocationID === locationId);
		const charIds = charsHere.map(char => char.id);
		setPresentCharacters(charIds);
	  }
	}, [scene, characters, locationId]);
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newSceneData = {
			locationId: sLocation,
			resolved: resolved,
			narrative: {
				narrationText: nText,
				presentCharacters: presentCharacters
			}
		};
		
		let savedScene;
		if(scene) {
			savedScene = updateScene(scene.id, newSceneData);
		}	
		else {
			savedScene = addScene(newSceneData);
		}
		
		if(savedScene.resolved) {
			manageSceneResolution(savedScene);
		}	
		
		onSaveComplete();
	};
	
	const handleSceneGenerate = async () => {
		setIsLoading(true);
		try{
			showNotification({type: 'status', message: 'Scene Generation Request Sent.'});
			const promptData = { locationId: sLocation, characterIds: presentCharacters, memoryDepth: memoryDepth };
			const prompt = text + atmosphere + buildScenePrompt(promptData);
		
			const aiResponse = await generateScene(prompt, modelName, provider);
			setNText(aiResponse);
		
			setResolved(true);
		}
		catch(error){
			console.error("Scene Generation Failed. ", error);
			setError(error.message || "An unexpected error occurred.");
		}
		finally{
			setIsLoading(false);
		}
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			{location && <LocationCard key={location.id} location={location} onEditClick={null} onDeleteClick={null} onSceneClick={null} isReadOnly={true}/>}
			 {error && <div className={styles.errorText}>{error}</div>}
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