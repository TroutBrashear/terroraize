import React, { useState, useEffect, useRef } from 'react';
import styles from './DispDropdown.module.css'; 

function DispDropdown({ children }) { 
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, menuRef]);

  const toggleOpen = () => {
    console.log('toggleOpen called!'); 
    setIsOpen(prevIsOpen => !prevIsOpen); 
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button onClick={toggleOpen} className={styles.dropdownbutton}>
        O
      </button>
      
      {isOpen && (
        <div className={styles.menu}>
          {children}
        </div>
      )}
    </div>
  );
}

export default DispDropdown;