
import React, { useEffect } from 'react';
import DashboardView from './views/DashboardView';
import SceneTimeline from './views/SceneTimeline';
import PoppinManager from './components/managers/PoppinManager';
import styles from './App.module.css';
import { useSettingStore } from './state/settingStore';
import { fetchKeyStatus } from './services/settings';



function App() {
  const setWriterAPISettings = useSettingStore((state) => state.setWriterAPISettings);

  useEffect(() => {
	const checkAPIKey = async () => {
		const status = await fetchKeyStatus();
		setWriterAPISettings({ isKeySet: status });
	};
	
	checkAPIKey();
	
  }, []);  
  
  return (
    <div className={styles.contentDisp}>
	  <main className={styles.mainDash}>
	    <DashboardView />
	  </main>
	  <footer>
		<SceneTimeline />
	  </footer>
	  
	  <PoppinManager />
    </div>
  );
}

export default App;
