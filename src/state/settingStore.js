import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingStore = create(
	persist((set) => ({
		api: {
			apiKey: '',
			modelName: 'deepseek-ai/DeepSeek-V3-0324', 
		},
		
		setAPISettings: (newSettings) => set((state) => ({
			api: {
				...state.api,
				...newSettings,
			}
		})),
	}), 

{ name: 'terroraize-settings' }
));