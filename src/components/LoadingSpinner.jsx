import React from 'react';
import { useLoadingStore } from '../state/loadingStore.js';
import styles from './LoadingSpinner.module.css';

function LoadingSpinner() {
	const isLoading = useLoadingStore((state) => state.isLoading);

	if(!isLoading)
	{
		return null;
	}

	return (
		<div className={styles.loader}></div>
	);
}

export default LoadingSpinner;