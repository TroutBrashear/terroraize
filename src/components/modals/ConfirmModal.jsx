import React from 'react';
import styles from '../Form.module.css';

function ConfirmModal({message, onConfirm, onCancel}) {

	return(
		<div>
			<p>{message}</p>
			<button className={styles.confirmWarnButton} onClick={onConfirm}>Confirm Deletion</button>
			<button onClick={onCancel}>Cancel</button>
		</div>
	);
}

export default ConfirmModal;