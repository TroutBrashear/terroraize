import React, { useState } from 'react';
import { useSettingStore } from '../state/settingStore';
import { saveApiKey } from '../services/settings'; 
import styles from './Form.module.css';

function WriterSettingsForm({onSaveComplete}) {
	const AI_PROVIDERS = [{id: 'featherless', name: 'Featherless'}];
	const updateAPISettings = useSettingStore((state) => state.setWriterAPISettings);
	const updatePromptSettings = useSettingStore((state) => state.setWriterPromptSettings);
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	
	const modelName = useSettingStore((state) => state.writerSettings.api.modelName);
	const prevProvider = useSettingStore((state) => state.writerSettings.api.provider)
	const promptText = useSettingStore((state) => state.writerSettings.prompt.text);
	const memoryDepth = useSettingStore((state) => state.writerSettings.prompt.memoryDepth);

	const [provider, setProvider] = useState(prevProvider);

	const isKeySet = useSettingStore((state) => state.writerSettings.api.isKeySet);
	const [key, setKey] = useState('');
	const [model, setModel] = useState(modelName || '');
	const [pText, setPText] = useState(promptText || '');
	const [mDepth, setMDepth] = useState(memoryDepth || '');
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);
		
		try {
			if(key !== '') {
				await saveApiKey(key);
				console.log(key);
			}
			
			const newAPISettings = {
				modelName: model,
				provider: provider,
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
			
			<label className={styles.label} htmlFor="providerSelect">Select an AI service provider:</label>
			<select id="providerSelect" value={provider} onChange={(e) => setProvider(e.target.value)}> 
				{AI_PROVIDERS.map(p => (
            		<option key={p.id} value={p.id}>
            		  {p.name}
            		</option>
          		))}
			</select>
			<label className={styles.label} htmlFor="apiKey">API Key </label>
			<input id="apiKey" className={styles.input} placeholder={isKeySet ? '••••••••••••••••' : 'Enter API Key'} value={key} onChange={(e) => setKey(e.target.value)} autoComplete="new-password"/>
			<label className={styles.label} htmlFor="modelName">AI Model </label>
			<input id="modelName" className={styles.input}  value={model} onChange={(e) => setModel(e.target.value)} />
			<label className={styles.label} htmlFor="sysPrompt">System Prompt </label>
			<input id="sysPrompt" className={styles.input} value={pText} onChange={(e) => setPText(e.target.value)} />
			<label className={styles.label} htmlFor="memDepth">Memory Depth </label>
			<input id="memDepth" className={styles.input} value={mDepth} onChange={(e) => setMDepth(e.target.value)} />
			
			
			<button className={styles.submitButton} type="submit" disabled={isSubmitting}>Submit</button>
		</form>
	);
}


export default WriterSettingsForm;