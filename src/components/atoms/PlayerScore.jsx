import PropTypes from 'prop-types';


const PlayerScore = ({ score }) => {
    return (
      <div className="text-2xl font-bold text-neutral">
        Score: {score}
      </div>
    );
  };

  PlayerScore.propTypes = {
    score: PropTypes.number.isRequired
  };
  
  export default PlayerScore;