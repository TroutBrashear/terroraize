import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 

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
		currentTurn: 1,
		lastSceneId: 1,
      },

      characters: [ { //SAMPLE CHARACTER FOR TESTING PURPOSES TODO: REMOVE ONCE THEY CAN BE CREATED
    id: 1,
    name: "Kaelen",
    currentLocationID: null,
    narrative: {
      description: "A bitter knight haunted by past failures.",
	  goals: [],
	  sceneHistory: [],
    },
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
	
	  scenes: [{
		id: 1,
		resolved: false,
		locationId: 1,
		narrative: {
			narrationText: "Scoopy went in the front door and ate like 16 sandwiches.",
			presentCharacters: []
		}
	  }],

    //FUNCTIONS
      addCharacter: (newCharacterData) => set((state) => {
        const newId = state.meta.lastCharacterId + 1;
        const newCharacter = {
          id: newId,
          ...newCharacterData,
          currentLocationID: null, // Always start unassigned
		  presentation: {
			color: "#ddbb54",
		  },
		  narrative: {
			...newCharacterData.narrative,
			goals: [],
			sceneHistory: [],
		  },
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
	  
	  addScene: (newSceneData) => set((state) => {
		const newId = state.meta.lastSceneId + 1;
		const newScene = {
			id: newId,
			turn: state.meta.currentTurn,
			status: 'pending',
			...newSceneData
		};
		return { 
			scenes: [...state.scenes, newScene],
			meta: { ...state.meta, lastSceneId: newId },
		};
	  }),
	
	  addGoal: (characterId, newGoal) => set((state) => ({
		characters: state.characters.map(char => {
			if (char.id !== characterId) {
				return char; // Not the right character, do nothing.
			}

			const updatedGoals = [...char.narrative.goals, newGoal];
		
			return {
				...char,
				narrative: {
					goals: updatedGoals,
				},
			};
		})
	  })),

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
	  
	  updateScene: (sceneId, updatedData) => set((state) => ({
		  scenes: state.scenes.map(scn =>
			scn.id === sceneId
			  ? { ...scn, ...updatedData }
			  : scn
		),
	  })),
	  
	  deleteCharacter: (characterId) => set((state) => ({
		  characters: state.characters.filter(char => {
			  return char.id !== characterId;
		  }),
	  })),
	  
	  deleteLocation: (locationId) => set((state) => {
		  const updatedLocations = state.locations.filter(loc => loc.id !== locationId);
		  const updatedCharacters = state.characters.map(char => {
			  if(char.currentLocationID === locationId){
				return { ...char, currentLocationID: null };
			  }
			  
			return char;
		});
		
		return {
			locations: updatedLocations,
			characters: updatedCharacters,
		};
	  }),
	  
	  deleteScene: (sceneId) => set((state) => ({
		  scenes: state.scenes.filter(scn => {
			return scn.id !== sceneId;
		  }),
	  })),
	  

      getCharactersByLocationId: (locationId) => {
        // The `get` function gives us access to the current state
        const allCharacters = get().characters;
        return allCharacters.filter(char => char.currentLocationID === locationId);
      },

	  getUnresolvedScenes: (turnId) => {
		  const allScenes = get().scenes;
		  return allScenes.filter(scene => scene.turn === turnId && scene.resolved === false)
	  },
	  
	  advTurn: () => set((state) => ({
		  meta: {
			...state.meta, currentTurn: state.meta.currentTurn +1,
		  }
	  }))
    }),
    {
      name: 'terroraize', // The key used in localStorage
    }
  )
);