import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NavItem = ({ label, to }) => (
  <li>
    <Link to={to} className="btn btn-ghost normal-case">
      {label}
    </Link>
  </li>
);

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default NavItem;
