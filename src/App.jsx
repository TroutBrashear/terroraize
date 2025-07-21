
import React from 'react';
import DashboardView from './views/DashboardView';
import SceneTimeline from './views/SceneTimeline';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.contentDisp}>
	  <main className={styles.mainDash}>
	    <DashboardView />
	  </main>
	  <footer>
		<SceneTimeline />
	  </footer>
    </div>
  );
}

export default App;
