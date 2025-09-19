import React, { useState, useEffect } from 'react';
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
      moveCharacter,
    } = useWorldStore.getState();

    const [finalDirections, setFinalDirections] = useState([]); 


    useEffect(() => {
    	setFinalDirections(directions);
    }, [directions]);

	const handleAIDirection = async () => {
		fetchDirectionsStart();
		try {
			const result = await generateDirection(modelName);
			fetchDirectionsSuccess(result);
		} catch (err) {
			if(err.message === "DIRECTOR_RESPONSE_PARSE_ERROR"){
				fetchDirectionsFailure("The AI response was not in the expected format. This is likely to happen with smaller models; please try again, or use a recommended model as Director.");
			}
			else{
				fetchDirectionsFailure(err.message);
			}
			
		}
	};

	const handleDeleteDirection = (id) => {
		setFinalDirections(currentDirections => currentDirections.filter(direction => direction.characterId !== id));

	};

	const handleClearDirections = () => {
		setFinalDirections([]);
		clearStagedDirections();
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		finalDirections.forEach((direction) => {
		  moveCharacter(direction.characterId, direction.nextLocationId);
		});
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
			{finalDirections.length > 0 && <button type="button" onClick={handleClearDirections}>Clear Directions</button>}
			<div>
			{finalDirections.map(dir=> (
				<div className={styles.formRow}>
					<p key={dir.characterId}>Character {dir.characterId}: Move to {dir.nextLocationId} to accomplish: {dir.intent}</p>
					<button type="button" onClick={() => handleDeleteDirection(dir.characterId)}>X</button>
				</div>
			))}
			</div>
			 <button className={styles.submitButton} type="submit">Confirm</button>
		</form>
	);
}

export default TurnDebriefModal;