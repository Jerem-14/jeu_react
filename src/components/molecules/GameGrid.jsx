import PropTypes from 'prop-types';
import MemoryCard from '../atoms/MemoryCard.jsx';

const GameGrid = ({ cards = [], onCardClick }) => {
  console.log('Cartes reçues:', cards);  
  return (
      <div className="grid grid-cols-8 gap-2">
        {cards.map((card, index) => (
          <MemoryCard
            key={index}
            media={card}
            isFlipped={Boolean(card?.isFlipped)}
            onClick={() => {
              console.log('Clic sur carte dans la grille:', index, card);
              onCardClick(index);
          }}
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