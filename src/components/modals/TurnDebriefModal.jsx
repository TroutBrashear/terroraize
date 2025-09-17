import React, { useState } from 'react';
import styles from '../Form.module.css';
import {} from '../../state/WorldStore';

function TurnDebriefModal({ turnNumber, onSaveComplete }) {
	
	const handleSubmit = (event) => {
		
		onSaveComplete();
	};
	
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2>End of Turn</h2>
			
			 <button className={styles.submitButton} type="submit">Confirm</button>
		</form>
	);
}

export default TurnDebriefModal;