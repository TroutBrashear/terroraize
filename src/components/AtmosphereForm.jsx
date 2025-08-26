import React, { useState, useEffect } from 'react';
import { useSettingStore } from '../state/settingStore';
import styles from './Form.module.css';

function AtmosphereForm({onSaveComplete}) {
	const updateAtmoSettings = useSettingStore((state) => state.setAtmoSettings);
	
	const text = useSettingStore((state) => state.writerSettings.atmosphere.text);
	const resetEachTurn = useSettingStore((state) => state.writerSettings.atmosphere.resetEachTurn);
	
	const [atmoText, setAtmoText] = useState(text || '');
	const [resetToggle, setResetToggle] = useState(resetEachTurn || true);

	const handleSubmit = (event) => {
		event.preventDefault();
		
		const newAtmoSettings = {
			text: atmoText,
			resetEachTurn: resetToggle,	
		};
		
		updateAtmoSettings(newAtmoSettings);
		
		onSaveComplete();
	};

	const handleCheckboxChange = (event) => {
 
		const shouldReset = event.target.checked; 

		setResetToggle(shouldReset);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2> Atmosphere Settings </h2>
			
			<label className={styles.label} htmlFor="text">Atmosphere Text </label>
			<input className={styles.input} value={atmoText} onChange={(e) => setAtmoText(e.target.value)} />
			
			<input type="checkbox" id="reset-atmo-toggle" checked={resetToggle} onChange={handleCheckboxChange}/>
			
			<button className={styles.submitButton} type="submit">Submit</button>
		</form>
	);

}

export default AtmosphereForm;