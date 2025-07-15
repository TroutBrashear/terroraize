import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import styles from './LocationForm.module.css';

function LocationForm({ onSaveComplete }) {
	// Get the action from the store
  const addLocation = useWorldStore((state) => state.addLocation);

  // State to hold the form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the browser from reloading the page

    // Construct the character data object based on our store's structure
    const newLocationData = {
      name: name,
      narrative: {
        description: description
      },
      // We can add other layers here later
      simulation: {},
      presentation: {}
    };
    
    // Call the action from the store!
    addLocation(newLocationData);

    // Tell the App component we're done so it can switch back
    onSaveComplete();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Location</h2>
      
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" rows="4" value={description} onChange={(e) =>setDescription(e.target.value)}></textarea>
      </div>
      
      <button type="submit">Save Location</button>
    </form>
  );
}

export default LocationForm;