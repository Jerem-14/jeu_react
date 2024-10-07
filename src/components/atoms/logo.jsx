import PropTypes from 'prop-types';

const Logo = ({ src, alt }) => (
  <div className="logo">
    <img src={src} alt={alt} className="h-10" />
  </div>
);

Logo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default Logo;
