import PropTypes from 'prop-types';
import PlayerScore from '@atoms/PlayerScore';

const PlayerInfo = ({ players }) => {

  if (!players || players.length === 0) {
    return null; // Ou un composant de chargement
  }

    return (
      <div className="space-y-4">
      {Object.values(players).map(player => (
        <div key={player.id} className="player-info">
          <h3 className="text-lg font-medium">{player.id}</h3>
          <PlayerScore 
            score={player.score || 0} 
             
          />
        </div>
      ))}
    </div>
    );
  };

  PlayerInfo.propTypes = {
    players: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        score: PropTypes.number
      })
    ).isRequired
  };
  
  export default PlayerInfo;