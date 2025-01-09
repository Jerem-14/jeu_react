import PropTypes from 'prop-types';

const GameStatus = ({ currentTurn }) => {
    return (
      <div className="text-xl text-base-content">
        Tour actuel : {currentTurn}
      </div>
    );
  };
  
  GameStatus.propTypes = {
    currentTurn: PropTypes.string.isRequired
  };
  
  export default GameStatus;