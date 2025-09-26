import React from 'react';
import { useNotificationStore } from '../state/notificationStore';
import styles from './Toast.module.css';


function Toast() {
	const { notificationType, notificationMessage, isOpen, hideNotification} = useNotificationStore();

	if(!isOpen)
	{
		return null;
	}

	const toastClassName = `${styles.toast} ${styles[notificationType]}`;
	return(
		<div className={toastClassName}>
			<p>{notificationMessage}</p>
			<button onClick={hideNotification}>X</button>
		</div>
	);
}

export default Toast;