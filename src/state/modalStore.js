import { create } from 'zustand';

export const useModalStore = create(
	(set, get) => ({
		modalType: null,
		modalData: null,
		isOpen: false,
	
	//functions
		openModal: (modalType, modalData) => set({
			modalType: modalType, modalData: modalData, isOpen: true,
		}),
		
		closeModal: () => set({
			modalType: null, modalData: null, isOpen: false,
		}),
	})
	
);