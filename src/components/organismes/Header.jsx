import Logo from '../atoms/Logo.jsx';
import Navbar from '../molecules/Navbar.jsx';
import Toggle from '../atoms/Toggle.jsx';
import Button from '../atoms/Button.jsx';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';


  const Header = ({ isAuthenticated, onLogout }) => {
    const location = useLocation();
    const showNavbar = isAuthenticated;


  return (
    <header className="navbar bg-base-100">
      <div className="flex-1">
        <a href='/'>
        <Logo src="/singe.svg" alt="Singe"  />
        </a>
      </div>
      <div className="flex-none gap-2">
         {showNavbar && (
          <>
            <Navbar />
            <Button type="button" text="Déconnexion" onClick={onLogout} />
          </>
        )}
        <Toggle />
      </div>
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export default Header;
