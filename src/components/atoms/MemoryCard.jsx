// Dans MemoryCard.jsx
import PropTypes from 'prop-types';

const MemoryCard = ({ media, isFlipped, onClick }) => {
  return (
    <div 
      className={`aspect-square cursor-pointer transition-transform duration-300 ${
        isFlipped ? 'rotate-y-180' : ''
      }`}
      onClick={onClick}
    >
      {isFlipped && media ? (
        media.type === 'image' ? (
          <img src={media.url} alt="card" className="w-full h-full object-cover" />
        ) : (
          <video src={media.url} className="w-full h-full object-cover" />
        )
      ) : (
        <div className="w-full h-full bg-base-300" />
      )}
    </div>
  );
};

MemoryCard.propTypes = {
  media: PropTypes.shape({
    type: PropTypes.oneOf(['image', 'video']),
    url: PropTypes.string
  }),
  isFlipped: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

MemoryCard.defaultProps = {
  media: null,
  isFlipped: false
};

export default MemoryCard;