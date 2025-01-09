import PropTypes from 'prop-types';
import MemoryCard from '../atoms/MemoryCard';

const GameGrid = ({ cards, onCardClick }) => {
    return (
      <div className="grid grid-cols-8 gap-2">
        {cards.map((card, index) => (
          <MemoryCard
            key={index}
            media={card}
            isFlipped={card.isFlipped || false}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>
    );
  };

  
  GameGrid.propTypes = {
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['image', 'video']),
        url: PropTypes.string,
        isFlipped: PropTypes.bool
      })
    ).isRequired,
    onCardClick: PropTypes.func.isRequired
  };
  
  export default GameGrid;