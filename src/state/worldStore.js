import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // We'll add this for saving to localStorage

// This is the main function from Zustand. We wrap it in `persist` middleware.
export const useWorldStore = create(
  persist(
    (set, get) => ({
      // =================================================================
      // PART 1: THE STATE (The Data)
      // All the data that defines your world lives here.
      // =================================================================

      meta: {
        lastCharacterId: 1,
        lastLocationId: 1,
      },

      characters: [ { //SAMPLE CHARACTER FOR TESTING PURPOSES TODO: REMOVE ONCE THEY CAN BE CREATED
    id: 1,
    name: "Kaelen",
    currentLocationID: null,
    narrative: {
      description: "A bitter knight haunted by past failures.",
    },
    // ... etc
	}],

      locations: [{ //SAMPLE LOCATION FOR TESTING PURPOSES TODO: REMOVE ONCE THEY CAN BE CREATED
      id: 1,
      name: "The Whispering Library",
      narrative: {
        description: "A towering, circular library filled with ancient, dust-covered tomes.",
      },
      presentation: {
        imageUrl: "/images/locations/library.jpg" // We'll use this later
      }
    }],

    //FUNCTIONS
      addCharacter: (newCharacterData) => set((state) => {
        const newId = state.meta.lastCharacterId + 1;
        const newCharacter = {
          id: newId,
          ...newCharacterData,
          currentLocationID: null, // Always start unassigned
        };
        return {
          characters: [...state.characters, newCharacter],
          meta: { ...state.meta, lastCharacterId: newId },
        };
      }),

      addLocation: (newLocationData) => set((state) => {
        const newId = state.meta.lastLocationId + 1;
        const newLocation = { id: newId, ...newLocationData };
        return {
          locations: [...state.locations, newLocation],
          meta: { ...state.meta, lastLocationId: newId },
        };
      }),

      // Moves a character to a location (or to unassigned if locationId is null)
      moveCharacter: (characterId, locationId) => set((state) => ({
        characters: state.characters.map(char =>
          char.id === characterId
            ? { ...char, currentLocationID: locationId }
            : char
        ),
      })),

      // A generic function to update any part of a character's data
      updateCharacter: (characterId, updatedData) => set((state) => ({
        characters: state.characters.map(char =>
          char.id === characterId
            ? { ...char, ...updatedData } // Merges the new data into the character
            : char
        ),
      })),

	  
	  updateLocation: (locationId, updatedData) => set((state) => ({
        locations: state.locations.map(loc =>
          loc.id === locationId
            ? { ...loc, ...updatedData } // Merges the new data into the character
            : loc
        ),
      })),
	  
      // =================================================================
      // PART 3: SELECTORS (A Pro-Tip for getting derived data)
      // These functions don't change state, they just read and compute it.
      // =================================================================

      getCharactersByLocationId: (locationId) => {
        // The `get` function gives us access to the current state
        const allCharacters = get().characters;
        return allCharacters.filter(char => char.currentLocationID === locationId);
      },

    }),
    {
      name: 'terroraize', // The key used in localStorage
    }
  )
);