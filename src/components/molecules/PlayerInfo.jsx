import PropTypes from 'prop-types';
import PlayerScore from '../atoms/PlayerScore';

const PlayerInfo = ({ players}) => {

  if (!players || players.length === 0) {
    return null; // Ou un composant de chargement
  }

    return (
      <div className="space-y-4">
      {players.map(player => (
        <div key={player.id} className="player-info">
          <h3 className="text-lg font-medium">{player.username}</h3>
          <PlayerScore 
            score={player.score || 0} 
            isActive={player.isActive || false} 
          />
        </div>
      ))}
    </div>
    );
  };

  PlayerInfo.propTypes = {
    players: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        score: PropTypes.number,
        isActive: PropTypes.bool
      })
    ).isRequired
  };
  
  export default PlayerInfo;