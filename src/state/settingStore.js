import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingStore = create(
	persist((set) => ({
		writerSettings: {
			api: {
				provider:'',
				isKeySet: false,
				modelName: 'deepseek-ai/DeepSeek-V3-0324', 
			},
			prompt: {
				text: '',
				memoryDepth: 3,
			},
			atmosphere: {
				text: '',
				resetEachTurn: true
			},
		},
		
		setWriterAPISettings: (newAPISettings) => set((state) => ({
				writerSettings: {
				
				...state.writerSettings,
			
				api: {
					...state.writerSettings.api,
					...newAPISettings,
				}
			}
		})),
		setWriterPromptSettings: (newPromptSettings) => set((state) => ({
			writerSettings: {
				...state.writerSettings,
			
				prompt: {
					...state.writerSettings.prompt,
					...newPromptSettings,
				}
			}
		})),
		setAtmoSettings: (newAtmoSettings) => set((state) => ({
			writerSettings: {
				...state.writerSettings,
			
				atmosphere: {
					...state.writerSettings.atmosphere,
					...newAtmoSettings,
				}
			}
		})),
	}), 

{ name: 'terroraize-settings' }
));