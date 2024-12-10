import { useState, useEffect } from 'react';

const Toggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });


  useEffect(() => {
    // Set initial theme
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
  }, []); // Run once on mount

  const handleToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    // Update document theme
    document.documentElement.setAttribute(
      'data-theme',
      newDarkMode ? 'dark' : 'light'
    );
  };
  
  return (
    <button className="btn btn-outline" onClick={handleToggle}>
      {darkMode ? '☀️' : '🌙'}
      {/* {darkMode ? '🌙' : '☀️'} */}
    </button>
  );
};

export default Toggle;
