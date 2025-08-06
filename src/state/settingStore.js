import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingStore = create(
	persist((set) => ({
		writerSettings: {
			api: {
				key: '',
				modelName: 'deepseek-ai/DeepSeek-V3-0324', 
			},
			prompt: {
				text: '',
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
	}), 

{ name: 'terroraize-settings' }
));