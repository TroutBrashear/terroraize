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

	  characters: { 
		entities: {
			'1': {
				id: 1,
				name: "Kaelen",
				currentLocationID: null,
				narrative: {
					description: "A bitter knight haunted by past failures.",
					goals: [],
					sceneHistory: [],
				},
			},
		},
		ids: [1]
	  },

      locations: { 
		entities: {
			'1': {
				id: 1,
				name: "The Whispering Library",
				narrative: {
					description: "A towering, circular library filled with ancient, dust-covered tomes.",
				},
				presentation: {
					imageUrl: "/images/locations/library.jpg" // We'll use this later
				}
			}
		},
		ids: [1]
	  },
	
	  scenes: [{
		id: 1,
		turn: 1,
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
			...newCharacterData.presentation,
		  },
		  narrative: {
			...newCharacterData.narrative,
			sceneHistory: [],
		  },
        };
        return {
          characters: { entities: { ...state.characters.entities, [newId]: newCharacter }, ids: [...state.characters.ids, newId] },
          meta: { ...state.meta, lastCharacterId: newId },
        };
      }),

      addLocation: (newLocationData) => set((state) => {
        const newId = state.meta.lastLocationId + 1;
        const newLocation = { id: newId, ...newLocationData };
        return {
          locations: { entities: {...state.locations.entities, [newId]: newLocation }, ids: [...state.locations.ids, newId]},
          meta: { ...state.meta, lastLocationId: newId },
        };
      }),
	  
	  addScene: (newSceneData) => set((state) => {
		const newId = state.meta.lastSceneId + 1;
		const charactersPresent = newSceneData.narrative.charactersPresent || [];
		const newScene = {
			id: newId,
			turn: state.meta.currentTurn,
			resolved: newSceneData.resolved,
			locationId: newSceneData.locationId,
			narrative: {
				narrationText: newSceneData.narrative.narrationText || '',
				charactersPresent: charactersPresent,
			}
		};
		return { 
			scenes: [...state.scenes, newScene],
			meta: { ...state.meta, lastSceneId: newId },
		};
	  }),
	
	  addGoal: (characterId, newGoal) => set((state) => {
		const characterToUpdate = state.characters.entities[characterId];
		
		const updatedGoals = [...characterToUpdate.narrative.goals, newGoal];
		
		const updatedCharacter = {
			...characterToUpdate,
			narrative: {
				...characterToUpdate.narrative,
				goals: updatedGoals,
			},
		};	

		return {
			characters: {
				...state.characters,
				entities: {
					...state.characters.entities,
					[characterId]: updatedCharacter
				}
			}
		};
	  }),

      // Moves a character to a location (or to unassigned if locationId is null)
      moveCharacter: (characterId, locationId) => set((state) => {
        const characterToUpdate = state.characters.entities[characterId];
		
		const updatedCharacter = {
			...characterToUpdate,
			currentLocationID: locationId,
		};	

		return {
			characters: {
				...state.characters,
				entities: {
					...state.characters.entities,
					[characterId]: updatedCharacter
				}
			}
		};
      }),

      // A generic function to update any part of a character's data
      updateCharacter: (characterId, updatedData) => set((state) => {
        const characterToUpdate = state.characters.entities[characterId];
		
		const updatedCharacter = {
			...characterToUpdate,
			...updatedData,
		};
		
        return {
			characters: {
				...state.characters,
				entities: {
					...state.characters.entities,
					[characterId]: updatedCharacter
				}
			}
		};
      }),

	  
	  updateLocation: (locationId, updatedData) => set((state) => {
        const locationToUpdate = state.locations.entities[locationId];
		
		const updatedLocation = {
			...locationToUpdate,
			...updatedData,
		};
		
		return {
			locations: {
				...state.locations,
				entities: {
					...state.locations.entities,
					[locationId]: updatedLocation
				}
			}
		};
      }),
	  
	  updateScene: (sceneId, updatedData) => set((state) => ({
		  scenes: state.scenes.map(scn =>
			scn.id === sceneId
			  ? { ...scn, ...updatedData }
			  : scn
		),
	  })),
	  
	  deleteCharacter: (characterId) => set((state) => {
		  const updatedCharacters = {...state.characters.entities};
		  
		  delete updatedCharacters[characterId];
		  
		  
		  const updatedIds = state.characters.ids.filter(id => {
			  return id !== characterId;
		  });
		  
		  return {
			characters: {
				entities: updatedCharacters,
				ids: updatedIds,
			}				
		  };
	  }),
	  
	  deleteLocation: (locationId) => set((state) => {
		  const updatedLocations = {...state.locations.entities};
		  const updatedCharacters = {...state.characters.entities};
		
		state.characters.ids.forEach(charId => {
			const character = updatedCharacters[charId];
			
			if(character.currentLocationId === locationId) {
				updatedCharacters[charId] = { ...character, currentLocationID: null };
			}
		});
		
		delete updatedLocations[locationId];
		
		const updatedIds = state.locations.ids.filter(id => {
			return id !== locationId;
		});
		
		return {
			locations: { 
				entities: updatedLocations,
				ids: updatedIds,
			},
			characters: {  ...state.characters, entities: updatedCharacters}
		};
	  }),
	  
	  deleteScene: (sceneId) => set((state) => ({
		  scenes: state.scenes.filter(scn => {
			return scn.id !== sceneId;
		  }),
	  })),
	  
	  manageSceneResolution: (scene) => set((state) => {
		if(!scene.narrative.charactersPresent) {
			return {};
		}
		
		const updatedCharacters = { ...state.characters.entities };
		 
		scene.narrative.charactersPresent.forEach(characterId => {
			const characterToUpdate = updatedCharacters[characterId];
			
			if(characterToUpdate) {
				const newHistory = [...characterToUpdate.narrative.sceneHistory, scene.id];
				
				const updatedCharacter = {
					...characterToUpdate,
					narrative: {
						...characterToUpdate.narrative,
						sceneHistory: newHistory,
					},
				};
				
				updatedCharacters[characterId] = updatedCharacter;
			}
		});
		 
		return {
			characters: { ...state.characters, entities: updatedCharacters },
		};
	  }),
	  
	  getCharacterById: (id) => get().characters.entities[id],
	  
	  getAllCharactersAsArray: () => {
		const { ids, entities } = get().characters;
		return ids.map(id => entities[id]);
	  },
	  
      getCharactersByLocationId: (locationId) => {
        const allCharacters = get().getAllCharactersAsArray();
        return allCharacters.filter(char => char.currentLocationID === locationId);
      },
	
	  getLocationById: (id) => get().locations.entities[id],

	  getAllLocationsAsArray: () => {
		const { ids, entities } = get().locations;
		return ids.map(id => entities[id]);
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
      name: 'terroraize', 
    }
  )
);