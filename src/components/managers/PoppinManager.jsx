import React, { useState } from 'react';
import { useModalStore } from '../../state/modalStore';
import Poppin from '../Poppin';
import CharacterForm from '../CharacterForm';
import LocationForm from '../LocationForm';
import SceneForm from '../SceneForm';
import WriterSettingsForm from '../WriterSettingsForm';
import AtmosphereForm from '../AtmosphereForm';
import TurnDebriefModal from '../modals/TurnDebriefModal';
import ConfirmModal from '../modals/ConfirmModal';

function PoppinManager() {
	
	const { isOpen, modalType, modalData, closeModal } = useModalStore();
	
	if(!isOpen) {
		return null;
	}
	
	
	switch(modalType) {
		case 'character_form':
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<CharacterForm characterToEdit={modalData} onSaveComplete={closeModal} />
				</Poppin>
			);
		case 'location_form':
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<LocationForm locationToEdit={modalData} onSaveComplete={closeModal} />
				</Poppin>
			);
		case 'scene_form': //a new scene, for now, I guess.
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<SceneForm scene={modalData.scene} locationId={modalData.locationId} onSaveComplete={closeModal}/>
				</Poppin>
			);
		case 'writer_settings_form':
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<WriterSettingsForm onSaveComplete={closeModal}/>
				</Poppin>
			);
		case 'turn_settings_form':
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<AtmosphereForm onSaveComplete={closeModal}/>
				</Poppin>
			);
		case 'turn_debrief_modal':
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<TurnDebriefModal onSaveComplete={closeModal}/>
				</Poppin>
			);
		case 'confirm_modal':
			return(
				<Poppin isOpen={true} onClose={closeModal}>
					<ConfirmModal message={modalData.message} onConfirm={() => {modalData.onConfirm(); closeModal();}} onCancel={closeModal}/>
				</Poppin>
			);
		default:
			console.warn(`Unhandled modal type "${modalType}"`);
			return null;
	}
};

export default PoppinManager;