import React from 'react';
import styles from './LocationCard.module.css';

function LocationCard({ location }) {
  // The component expects to receive a 'location' object.
  // If for some reason it doesn't get one, it returns nothing.
  if (!location) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{location.name}</h3>
      <p className={styles.description}>{location.narrative.description}</p>
    </div>
  );
}

export default LocationCard;