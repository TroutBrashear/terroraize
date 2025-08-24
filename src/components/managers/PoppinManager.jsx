import React, { useState } from 'react';
import Poppin from '../Poppin';
import CharacterForm from '../CharacterForm';
import LocationForm from '../LocationForm';
import SceneForm from '../SceneForm';
import WriterSettingsForm from '../WriterSettingsForm';
import AtmosphereForm from '../AtmosphereForm';

function PoppinManager({poppinType, data, onClose}) {
	
	if(!poppinType) {
		return null;
	}
	
	
	switch(poppinType) {
		case 'character_form':
			return(
				<Poppin isOpen={true} onClose={onClose}>
					<CharacterForm characterToEdit={data} onSaveComplete={onClose} />
				</Poppin>
			);
		case 'location_form':
			return(
				<Poppin isOpen={true} onClose={onClose}>
					<LocationForm locationToEdit={data} onSaveComplete={onClose} />
				</Poppin>
			);
		case 'scene_form': //a new scene, for now, I guess.
			return(
				<Poppin isOpen={true} onClose={onClose}>
					<SceneForm scene={null} locationId={data} onSaveComplete={onClose}/>
				</Poppin>
			);
		case 'writer_settings_form':
			return(
				<Poppin isOpen={true} onClose={onClose}>
					<WriterSettingsForm onSaveComplete={onClose}/>
				</Poppin>
			);
		case 'turn_settings_form':
			return(
				<Poppin isOpen={true} onClose={onClose}>
					<AtmosphereForm onSaveComplete={onClose}/>
				</Poppin>
			);
		default:
			return null;
	}
};

export default PoppinManager;