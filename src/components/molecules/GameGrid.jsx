import PropTypes from 'prop-types';
import MemoryCard from '../atoms/MemoryCard.jsx';

const GameGrid = ({ cards = [], onCardClick }) => {
  
  const getGridClasses = (cardCount) => {
    switch(cardCount) {
      case 16: // 4x4
        return 'grid-cols-2 md:grid-cols-4';
      case 24: // 4x6
        return 'grid-cols-2 md:grid-cols-6';
      case 36: // 6x6
        return 'grid-cols-2 md:grid-cols-6';
      case 48: // 6x8
        return 'grid-cols-2 md:grid-cols-8';
      default:
        return 'grid-cols-2 md:grid-cols-4';
    }
  };
  const gridClasses = getGridClasses(cards.length);
  
  console.log('Cartes reçues:', cards);  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className={`grid gap-2 md:gap-4 w-full max-w-3xl mx-auto ${gridClasses} p-4`}>
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