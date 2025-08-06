import React, { useState, useEffect } from 'react';
import { useSettingStore } from '../state/settingStore';
import styles from './Form.module.css';

function WriterSettingsForm({onSaveComplete}) {
	const updateAPISettings = useSettingStore((state) => state.setWriterAPISettings);
	const updatePromptSettings = useSettingStore((state) => state.setWriterPromptSettings);
	
	const apiKey = useSettingStore((state) => state.writerSettings.api.key);
	const modelName = useSettingStore((state) => state.writerSettings.api.modelName);
	const promptText = useSettingStore((state) => state.writerSettings.prompt.text);
	
	const [key, setKey] = useState(apiKey || '');
	const [model, setModel] = useState(modelName || '');
	const [pText, setPText] = useState(promptText || '');
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newAPISettings = {
			key: key,
			modelName: model,
		};
		const newPromptSettings = {
			text: pText,
		};
		console.log(newAPISettings);
		
		updateAPISettings(newAPISettings);
		updatePromptSettings(newPromptSettings);
		
		onSaveComplete();
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2> Writer Settings </h2>
			
			<input className={styles.input}  value={key} onChange={(e) => setKey(e.target.value)} />
			<input className={styles.input}  value={model} onChange={(e) => setModel(e.target.value)} />
			
			<input className={styles.input} value={pText} onChange={(e) => setPText(e.target.value)} />
			
			<button className={styles.submitButton} type="submit">Submit</button>
		</form>
	);
}


export default WriterSettingsForm;