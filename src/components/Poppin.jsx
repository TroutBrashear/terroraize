import React from 'react';
import styles from './Poppin.module.css';

// It takes an 'isOpen' prop to control visibility,
// an 'onClose' function to close it,
// and 'children' for the content inside.
function PoppIn({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null; // If not open, render nothing.
  }

  return (
    // The onClick for the overlay allows closing the modal by clicking the background.
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation prevents a click inside the content from closing the modal */}
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default PoppIn;