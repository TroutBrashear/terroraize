import React, { useState } from 'react';
import styles from '../Form.module.css';
import { useWorldStore } from '../../state/worldStore';
import { useSettingStore } from '../../state/settingStore';
import { generateDirection } from '../../services/ai';

function TurnDebriefModal({ turnNumber, onSaveComplete }) {
	const { isLoading, error, directions } = useWorldStore((state) => state.turnResAssist);
	const modelName = useSettingStore((state) => state.writerSettings.api.modelName);
	const { 
      fetchDirectionsStart, 
  	  fetchDirectionsSuccess, 
      fetchDirectionsFailure,
      clearStagedDirections,
      advTurn,
    } = useWorldStore.getState();

	const handleAIDirection = async () => {
		fetchDirectionsStart();
		try {
			const result = await generateDirection(modelName);
			fetchDirectionsSuccess(result);
		} catch (err) {
			fetchDirectionsFailure(err.message);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		advTurn();
		clearStagedDirections();
		onSaveComplete();
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2>End of Turn</h2>
			<button className={styles.submitButton} onClick={handleAIDirection} disabled={isLoading} type="button">{isLoading ? 'Director is thinking...' : 'Ask the AI Director'}</button>
			
			{error && <p className={styles.errorText}>Error: {error}</p>}

			<h3>AI Directions:</h3>
			<div>
			{directions.map(dir=> (
				<p>Character {dir.characterId}: Move to {dir.nextLocationId} to accomplish: {dir.intent}</p>
			))}
			</div>
			 <button className={styles.submitButton} type="submit">Confirm</button>
		</form>
	);
}

export default TurnDebriefModal;