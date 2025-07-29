import React, { useState, useEffect } from 'react';
import { useSettingStore } from '../state/settingStore';
import styles from './Form.module.css';

function WriterSettingsForm({onSaveComplete}) {
	const updateSettings = useSettingStore((state) => state.setAPISettings);
	
	const apiKey = useSettingStore((state) => state.api.apiKey);
	const modelName = useSettingStore((state) => state.api.modelName);
	
	const [key, setKey] = useState(apiKey || '');
	const [model, setModel] = useState(modelName || '');
	
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newSettings = {
			apiKey: key,
			modelName: model,
		};
		
		updateSettings(newSettings)
		
		onSaveComplete();
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2> Writer Settings </h2>
			
			<input className={styles.input}  value={key} onChange={(e) => setKey(e.target.value)} />
			<input className={styles.input}  value={model} onChange={(e) => setModel(e.target.value)} />
			
			<button className={styles.submitButton} type="submit">Submit</button>
		</form>
	);
}


export default WriterSettingsForm;