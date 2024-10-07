import NavItem from '../atoms/NavItem';

const Navbar = () => (
  <ul className="menu menu-horizontal px-1 text-base-content">
    <NavItem label="Home" to="/" />
    <NavItem label="Profile" to="/profile" />
    <NavItem label="Settings" to="/settings" />
  </ul>
);

export default Navbar;
