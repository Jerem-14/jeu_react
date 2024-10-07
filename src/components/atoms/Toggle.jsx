import { useState } from 'react';

const Toggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'light' : 'dark'
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
