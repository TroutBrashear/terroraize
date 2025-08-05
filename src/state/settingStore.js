import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingStore = create(
	persist((set) => ({
		writerSettings: {
			api: {
				apiKey: '',
				modelName: 'deepseek-ai/DeepSeek-V3-0324', 
			},	
		}
		
		setWriterAPISettings: (newAPISettings) => set((state) => ({
				api: {
					...state.writerSettings.api,
					...newAPISettings,
				}
			})),
	}), 

{ name: 'terroraize-settings' }
));