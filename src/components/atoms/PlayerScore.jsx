import PropTypes from 'prop-types';


const PlayerScore = ({ score, isActive }) => {
    return (
      <div className={`text-2xl font-bold ${
        isActive ? 'text-primary' : 'text-base-content'
      }`}>
        Score: {score}
      </div>
    );
  };

  PlayerScore.propTypes = {
    score: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired
  };
  
  export default PlayerScore;