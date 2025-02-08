import PropTypes from 'prop-types';

const Label = ({ text, htmlFor }) => (
  <label className="flex justify-content: flex-end; pb-2 text-base-content" htmlFor={htmlFor}>{text}</label>
);

Label.propTypes = {
    text: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
  };
export default Label;
