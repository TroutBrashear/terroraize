import React, { useState } from 'react';
import { useSettingStore } from '../state/settingStore';
import { saveApiKey } from '../services/settings'; 
import styles from './Form.module.css';

function WriterSettingsForm({onSaveComplete}) {
	const updateAPISettings = useSettingStore((state) => state.setWriterAPISettings);
	const updatePromptSettings = useSettingStore((state) => state.setWriterPromptSettings);
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	
	const modelName = useSettingStore((state) => state.writerSettings.api.modelName);
	const promptText = useSettingStore((state) => state.writerSettings.prompt.text);
	const memoryDepth = useSettingStore((state) => state.writerSettings.prompt.memoryDepth);
	
	const [key, setKey] = useState('');
	const [model, setModel] = useState(modelName || '');
	const [pText, setPText] = useState(promptText || '');
	const [mDepth, setMDepth] = useState(memoryDepth || '');
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);
		
		try {
			await saveApiKey(key);
			
			const newAPISettings = {
				modelName: model,
			};
			const newPromptSettings = {
				text: pText,
				memoryDepth: mDepth,
			};
			console.log(newAPISettings);
		
			updateAPISettings(newAPISettings);
			updatePromptSettings(newPromptSettings);
		
			onSaveComplete();
		} 
		catch(err){
			setError(err.message || 'Error occurred.');
		}
		finally {
			setIsSubmitting(false);
		}
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2> Writer Settings </h2>
			
			<input className={styles.input}  value={key} onChange={(e) => setKey(e.target.value)} />
			<input className={styles.input}  value={model} onChange={(e) => setModel(e.target.value)} />
			
			<input className={styles.input} value={pText} onChange={(e) => setPText(e.target.value)} />
			<input className={styles.input} value={mDepth} onChange={(e) => setMDepth(e.target.value)} />
			
			
			<button className={styles.submitButton} type="submit" disabled={isSubmitting}>Submit</button>
		</form>
	);
}


export default WriterSettingsForm;