import { describe, it, expect, beforeEach } from 'vitest';

import { useWorldStore } from '../src/state/worldStore';

const initialState = useWorldStore.getState();

describe('worldStore character actions', () => {

	beforeEach(() => { //Provide clean slate prior to every test case
		useWorldStore.setState(initialState);
	});

	it('should correctly add a new character', () => {
		const addCharacter = useWorldStore.getState().addCharacter;
		const initialCharacters = useWorldStore.getState().characters;
		expect(initialCharacters.ids.length).toBe(1);

		const newCharacterData = {
			name: "John Karnady",
			narrative: { description: "John Karnady was almost a President."}
		};

		addCharacter(newCharacterData);

		const finalCharacters = useWorldStore.getState().characters;

		expect(finalCharacters.ids.length).toBe(2);
		const newId = finalCharacters.ids[1];
		expect(newId).toBe(2);

		const addedCharacter = finalCharacters.entities[newId];
		expect(addedCharacter).toBeDefined();
		expect(addedCharacter.name).toBe("John Karnady");
		expect(addedCharacter.narrative.description).toBe("John Karnady was almost a President.");
		expect(addedCharacter.currentLocationID).toBeNull();
	});

	it('should correctly update an existing character', () => {
		const updateCharacter = useWorldStore.getState().updateCharacter;
		const characterToUpdateId = 1;

		const updateData = {
			name: "Sir Kaelen",
			currentLocationID: 1
		};

		updateCharacter(characterToUpdateId, updateData);

		const finalCharacter = useWorldStore.getState().characters.entities[characterToUpdateId];
		expect(finalCharacter.name).toBe("Sir Kaelen");
		expect(finalCharacter.currentLocationID).toBe(1);
		expect(finalCharacter.narrative.description).toBe("A bitter knight haunted by past failures.");
	});

	it('should correctly delete an existing character', () => {
		const deleteCharacter = useWorldStore.getState().deleteCharacter;
		const characterToDeleteId = 1;

		deleteCharacter(characterToDeleteId);

		const finalCharacter = useWorldStore.getState().characters.entities[characterToDeleteId];
		expect(finalCharacter).toBeUndefined();
	});
});

describe('worldStore location actions', () => {
	beforeEach(() => { //Provide clean slate prior to every test case
		useWorldStore.setState(initialState);
	});

	it('should correctly add a new location', () => {
		const addLocation = useWorldStore.getState().addLocation;
		const initialLocations = useWorldStore.getState().locations;
		expect(initialLocations.ids.length).toBe(1);

		const newLocationData = {
			name: "Tacky Lobster Family Restaurant",
			narrative: { description: "A B-tier family restaurant catering to seafood tastes."}
		};

		addLocation(newLocationData);

		const finalLocations = useWorldStore.getState().locations;

		expect(finalLocations.ids.length).toBe(2);
		const newId = finalLocations.ids[1];
		expect(newId).toBe(2);

		const addedLocation = finalLocations.entities[newId];
		expect(addedLocation).toBeDefined();
		expect(addedLocation.name).toBe("Tacky Lobster Family Restaurant");
		expect(addedLocation.narrative.description).toBe("A B-tier family restaurant catering to seafood tastes.");
	});

	it('should correctly update an existing location', () => {
		const updateLocation = useWorldStore.getState().updateLocation;
		const locationToUpdateId = 1;

		const updateData = {
			name: "Bigger Library"
		};

		updateLocation(locationToUpdateId, updateData);

		const finalLocation = useWorldStore.getState().locations.entities[locationToUpdateId];
		expect(finalLocation.name).toBe("Bigger Library");
		expect(finalLocation.narrative.description).toBe("A towering, circular library filled with ancient, dust-covered tomes.");
	});

	it('should correctly delete an existing location and unplace characters that were at the deleted location', () => {
		const { deleteLocation, editCharacter, moveCharacter } = useWorldStore.getState();
		const locationToDeleteId = 1;
		const characterToMoveId = 1;

		moveCharacter(characterToMoveId, locationToDeleteId);
		const interimCharacter = useWorldStore.getState().characters.entities[characterToMoveId];
		expect(interimCharacter.currentLocationID).toBe(locationToDeleteId);

		deleteLocation(locationToDeleteId);


		const finalLocation = useWorldStore.getState().locations.entities[locationToDeleteId];
		expect(finalLocation).toBeUndefined();

		const finalCharacter = useWorldStore.getState().characters.entities[characterToMoveId];
		expect(finalCharacter.currentLocationID).toBeNull();
	});
});