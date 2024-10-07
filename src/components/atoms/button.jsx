import PropTypes from 'prop-types';

const Button = ({ type, text, className }) => (
  <button type={type} className={`btn ${className}`}>
    {text}
  </button>
);

Button.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Button;
