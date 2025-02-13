// GameBoard.jsx
import PropTypes from 'prop-types';
import GameGrid from '../molecules/GameGrid.jsx';
import PlayerInfo from '../molecules/PlayerInfo.jsx';
import GameStatus from '../atoms/GameStatus.jsx'

const GameBoard = ({ gameState, onMove }) => {

  if (!gameState) {
    return <div>Loading...</div>;
  }

    return (
    <div className="game-board">
      <PlayerInfo players={gameState.players} currentTurn={gameState.currentTurn} />
      <GameStatus currentTurn={gameState.currentTurn || 'En attente...'} />
      <GameGrid 
        cards={gameState.cards} 
        onCardClick={onMove}
      />
    </div>
  );
};

  GameBoard.propTypes = {
    gameState: PropTypes.shape({
      players: PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
          score: PropTypes.number.isRequired,
          isActive: PropTypes.bool.isRequired
        })
      ).isRequired,
      cards: PropTypes.array.isRequired,
      currentTurn: PropTypes.string.isRequired
    }).isRequired,
    onMove: PropTypes.func.isRequired

  };
  
  export default GameBoard;