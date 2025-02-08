// GameBoard.jsx
import PropTypes from 'prop-types';
import GameGrid from '@molecules/GameGrid';
import PlayerInfo from '@molecules/PlayerInfo';
import GameStatus from '@atoms/GameStatus'

const GameBoard = ({ gameState, onMove }) => {

  if (!gameState) {
    return <div>Loading...</div>;
  }

    return (
    <div className="game-board">
      <PlayerInfo players={gameState.players} currentTurn={gameState.currentTurn} />
      <GameGrid 
        cards={gameState.cards} 
        onCardClick={onMove}
      />
      <GameStatus currentTurn={gameState.currentTurn || 'En attente...'} />
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