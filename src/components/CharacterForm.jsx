import React, { useState } from 'react';
import { useWorldStore } from '../state/worldStore';
import styles from './Form.module.css';

function CharacterForm({ onSaveComplete }) {
	// Get the action from the store
  const addCharacter = useWorldStore((state) => state.addCharacter);

  // State to hold the form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the browser from reloading the page

    // Construct the character data object based on our store's structure
    const newCharacterData = {
      name: name,
      narrative: {
        description: description
      },
      // We can add other layers here later
      simulation: {},
      presentation: {}
    };
    
    // Call the action from the store!
    addCharacter(newCharacterData);

    // Tell the App component we're done so it can switch back
    onSaveComplete();
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create New Character</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="name">Name</label>
        <input className={styles.input} type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea className={styles.textarea} id="description" rows="4" value={description} onChange={(e) =>setDescription(e.target.value)}></textarea>
      </div>
      
      <button className={styles.submitButton} type="submit">Save Character</button>
    </form>
  );
}

export default CharacterForm;