import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
	persist((set) => ({
		api: {
			apiKey: '',
			modelName: 'gpt-3.5-turbo', 
		}
		
		setAPISettings: (newSettings) => set((state) => ({
			api: {
				...state.api,
				...newSettings,
			}
		})),
	}), 

{ name: 'terroraize-settings' }));