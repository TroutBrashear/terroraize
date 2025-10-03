import { create } from 'zustand';

export const useLoadingStore = create(
	(set, get) => ({
		isLoading: false,

		showLoader: () => {
			set({isLoading: true});
		},

		hideLoader: () => {
			set({isLoading: false});
		},
	})
);