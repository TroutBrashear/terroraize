import React, { useState, useEffect } from 'react';
import { useWorldStore } from '../state/worldStore';
import styles from './Form.module.css';

function CharacterForm({ characterToEdit, onSaveComplete }) {
	// Get the action from the store
  const addCharacter = useWorldStore((state) => state.addCharacter);
  const updateCharacter = useWorldStore((state) => state.updateCharacter);
  
  // State to hold the form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState([]);
  const [color, setColor] = useState([]);

  useEffect(() => {
	if(characterToEdit) {
		setName(characterToEdit.name);
		setDescription(characterToEdit.narrative.description || '');
		setGoals(characterToEdit.narrative.goals || []);
		setColor(characterToEdit.presentation?.color || '#555555');
	}
	else {
		setName('');
		setDescription('');
		setGoals([]);
		setColor('#555555');
    }
	}, [characterToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the browser from reloading the page
    
    // Either update or create the character
	if(characterToEdit){
		const newCharacterData = {
			name: name,
			narrative: {
				...characterToEdit.narrative,
				description: description,
				goals: goals
			},
			// We can add other layers here later
			simulation: {},
			presentation: {
				color: color
			}
		};
		updateCharacter(characterToEdit.id, newCharacterData);
	}
	else {
		const newCharacterData = {
			name: name,
			narrative: {
				description: description,
				goals: goals
			},
			// We can add other layers here later
			simulation: {},
			presentation: {
				color: color
			}
		};
		addCharacter(newCharacterData);
	}
	
	
    // Tell the App component we're done so it can switch back
    onSaveComplete();
  };
  
  const handleAddGoal = () => {
	  const updatedGoals = [...goals, ''];
	  setGoals(updatedGoals);
  };
  
  const handleGoalChange = (newIndex, newGoal) => {
	const updatedGoals = goals.map((goal, index) => {
		if(index === newIndex) {
			return newGoal;
		}			
		return goal;
	});
	setGoals(updatedGoals);
  };
  
  const handleRemoveGoal = (delIndex) => {
	const updatedGoals = goals.filter((goal, index) => {
			return index !== delIndex;
	});
	setGoals(updatedGoals);
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create New Character</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="name">Name</label>
        <input className={styles.input} type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      
	  <div className={styles.formGroup}>
		<label className={styles.label} htmlFor="color">Color</label>
		<input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
	  </div>
	  
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea className={styles.textarea} id="description" rows="4" value={description} onChange={(e) =>setDescription(e.target.value)}></textarea>
      </div>
	  
	  <div className={styles.formGroup}>
		<label className={styles.label}>Goals</label>
		<button type="button" onClick={handleAddGoal}>Add Goal</button>
			{goals.map((gol, index) =>
				<div className={styles.formRow}>
					<button type="button" onClick={() => handleRemoveGoal(index)}>X</button>
					<input className={styles.input} key={index} value={gol} onChange={(e) => handleGoalChange(index, e.target.value)} />
				</div>
			)}
	  </div>
      
      <button className={styles.submitButton} type="submit">Save Character</button>
    </form>
  );
}

export default CharacterForm;