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