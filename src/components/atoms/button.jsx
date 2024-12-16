import PropTypes from 'prop-types';

const Button = ({ type, text, className, onClick }) => (
  <button type={type} className={`btn ${className}`} onClick={onClick}>
    {text}
  </button>
);

Button.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
