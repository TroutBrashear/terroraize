import { create } from 'zustand';

export const useNotificationStore = create(
	(set, get) => ({
		notificationType: null,
		notificationMessage: null,
		isOpen: false,
		timeoutId: null,

		showNotification: (messageData) => {
			const { timeoutId } = get();

			if(timeoutId) {
				clearTimeout(timeoutId);
			}

			const newTimeoutId = setTimeout(() => {
				set({isOpen:false, timeoutId: null});
			}, 4000);

			set({
				isOpen: true,
				notificationType: messageData.type,
				notificationMessage: messageData.message,
				timeoutId: newTimeoutId
			});

			
		},

		hideNotification: () => {
			const { timeoutId } = get();

			if(timeoutId) {
				clearTimeout(timeoutId);
			}

			set({isOpen:false, timeoutId: null});
		},
	})
);