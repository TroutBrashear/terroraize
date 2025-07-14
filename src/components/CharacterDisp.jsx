import React from 'react';
import styles from './CharacterDisp.module.css';

function CharacterDisp({ character }) {
  // The component expects to receive a 'location' object.
  // If for some reason it doesn't get one, it returns nothing.
  if (!character) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{character.name}</h3>
      <p className={styles.description}>{character.narrative.description}</p>
    </div>
  );
}

export default CharacterDisp;