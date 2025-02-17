import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, User, Mail, GamepadIcon, Award } from 'lucide-react';
import UserService from '../services/UserService.jsx';
import GameService from '../services/GameService.jsx';

// Helper function to calculate stats from game history
const calculateStats = (gamesResponse, userId) => {
  if (!gamesResponse.success || !gamesResponse.data) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      winRate: 0
    };
  }
  
  const games = gamesResponse.data;
  console.log("Calculating stats for games:", games);
  
  const stats = {
    totalGames: games.length,
    wins: 0,
    losses: 0,
    ties: 0,
    winRate: 0
  };

  games.forEach(game => {
    if (game.state === 'finished') {
      if (game.winner === userId) {
        stats.wins++;
      } else if (game.winner === null) {
        stats.ties++;
      } else {
        stats.losses++;
      }
    }
  });

  stats.winRate = stats.totalGames > 0
    ? Math.round((stats.wins / stats.totalGames) * 100)
    : 0;

  return stats;
};


const Profile = () => {

  const navigate = useNavigate();


  console.log("ProfilePage component rendering");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    firstname: '',
    lastname: ''
  });
  
  const [userData, setUserData] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    winRate: 0,
    bestScrore: 0
  });

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      //console.log("Starting to load user data with token:", token);
      
      if (token) {
        try {
          // Decode JWT token
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          //console.log("Decoded token:", decodedToken);
          
          if (decodedToken.id) {

            // Charger les stats en premier
            const statsResponse = await UserService.getGameStats(decodedToken.id);
            console.log("Stats response complète:", {
              success: statsResponse.success,
              data: statsResponse.data,
              bestScrore: statsResponse.data?.bestScrore
          });
          if (statsResponse.success) {
              console.log('Setting gameStats with:', statsResponse.data);
              setGameStats(statsResponse.data);
          }

            // Fetch user data
            const userResponse = await UserService.getUserById(decodedToken.id);
            if (userResponse.success) {
              setUserData(userResponse.data);
              
              // Fetch games history
              const gamesResponse = await UserService.getUserGames(decodedToken.id);
              console.log("Games response:", gamesResponse);
              if (gamesResponse.success) {
                setGameHistory(gamesResponse.data);
              }
  
            }
          }
        } catch (error) {
          console.error("Error in loadUserData:", error);
        }
      }
    };
  
    loadUserData();
  }, []);

/*   console.log("Current state - userData:", userData);
  console.log("Current state - gameHistory:", gameHistory);
  console.log("Current state - gameStats:", gameStats); */

  if (!userData) {
    //console.log("Rendering loading state");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  /* console.log("Loading state triggered:", {
    token: localStorage.getItem('token'),
    userData: userData,
    isLoading: !userData
  }); */

  return (
    
    <div className="container mx-auto p-4 space-y-6">
      {/* Basic Info Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl flex items-center gap-2 text-base-content">
            <User className="h-6 w-6" />
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              {isEditing ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem('token');
                  const decodedToken = JSON.parse(atob(token.split('.')[1]));
                  
                  const response = await UserService.updateUser(decodedToken.id, editForm);
                  if (response.success) {
                    setUserData({
                      ...userData,
                      ...editForm
                    });
                    setIsEditing(false);
                  } else {
                    alert(response.error);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Username</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">First Name</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.firstname}
                        onChange={(e) => setEditForm({...editForm, firstname: e.target.value})}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Last Name</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.lastname}
                        onChange={(e) => setEditForm({...editForm, lastname: e.target.value})}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-primary">Save</button>
                      <button 
                        type="button" 
                        className="btn btn-ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-base-content">
                    <span className="font-semibold">Username:</span>
                    <span>{userData.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content">
                    <span className="font-semibold">Full Name:</span>
                    <span>{`${userData.firstname} ${userData.lastname}`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditForm({
                        username: userData.username,
                        firstname: userData.firstname,
                        lastname: userData.lastname
                      });
                      setIsEditing(true);
                    }}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Stats Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl flex items-center gap-2 text-base-content">
            <GamepadIcon className="h-6 w-6" />
            Game Statistics
          </h2>
          
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200">
            {/* Best Score */}
            <div className="stat">
              <div className="stat-figure text-primary">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="stat-title">Best Score</div>
              <div className="stat-value text-primary"> {typeof gameStats.bestScrore === 'number' ? gameStats.bestScrore : 0}</div>
            </div>

            {/* Win Rate */}
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Win Rate</div>
              <div className="stat-value text-secondary">{gameStats.winRate}%</div>
            </div>

            {/* Total Games */}
            <div className="stat">
              <div className="stat-title">Total Games</div>
              <div className="stat-value">{gameStats.totalGames}</div>
              <div className="stat-desc">All time</div>
            </div>

            {/* Record */}
            <div className="stat">
              <div className="stat-title">Record</div>
              <div className="stat-value text-base">
                {gameStats.wins}W - {gameStats.losses}L - {gameStats.ties}T
              </div>
              <div className="stat-desc">Wins - Losses - Ties</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games History */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl text-base-content">Recent Games</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>Result</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
<tbody>
  {gameHistory?.data && gameHistory.data.length > 0 ? (
    gameHistory.data.map((game) => {
      // Determine l'adversaire
      const opponent = game.creator === userData.id 
        ? game.player2?.username 
        : game.player1?.username;


        const getResultClass = (type) => {
          switch(type) {
            case 'Victoire': return 'text-success font-bold';
            case 'Défaite': return 'text-error font-bold';
            case 'Égalité': return 'text-warning font-bold';
            case 'En cours': return 'text-info animate-pulse';
            default: return 'text-base-content';
          }
        };

        const getScoreDisplay = (game) => {
          if (game.state === 'pending') {
              return 'En attente...';
          }
          
          if (game.state === 'playing') {
              // Vérifier si nous avons les scores actuels
              if (game.userScore !== null && game.opponentScore !== null) {
                  return (
                      <div className="flex flex-col">
                          <span className="text-info">
                              {game.userScore} - {game.opponentScore}
                          </span>
                          <span className="text-xs text-base-content/70">
                              Score actuel
                          </span>
                      </div>
                  );
              }
              return 'Partie en cours...';
          }
          
          if (game.state === 'finished') {
              return (
                  <div className="flex flex-col">
                      <span>
                          {game.userScore} - {game.opponentScore}
                      </span>
                      <span className="text-xs text-base-content/70">
                          Score final
                      </span>
                  </div>
              );
          }
          
          return '-';
      };
        
      // Determine le résultat et sa classe CSS
      /* let result, resultClass;
      switch(game.state) {
        case 'finished':
          if (game.winner === userData.id) {
            result = 'Victoire';
            resultClass = 'text-success';
          } else if (game.winner === null) {
            result = 'Égalité';
            resultClass = 'text-warning';
          } else {
            result = 'Défaite';
            resultClass = 'text-error';
          }
          break;
        case 'playing':
          result = 'En cours';
          resultClass = 'text-info';
          break;
        default:
          result = 'En attente';
          resultClass = 'text-base-content';
      } */

      return (
        <tr key={game.id} className={game.state === 'playing' ? 'bg-base-200/50' : ''}>
          <td class="text-base-content">{new Date(game.createdAt).toLocaleDateString('fr-FR')}{game.state === 'playing' && (
            <span className="ml-2 badge badge-sm badge-info animate-pulse">
                Live
            </span>
        )}</td>
          <td class="text-base-content">{opponent || 'En attente...'}</td>
          <td className={getResultClass(game.gameType)}>{game.gameType}
            {game.state === 'finished' && game.margin > 0 && 
              ` (+${game.margin} paires)`}
            </td>
          <td class="text-base-content">{getScoreDisplay(game)}</td>
          <td>
              {game.state === 'playing' && (
                <div className="flex gap-2">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/game/${game.id}/play`)}
                  >
                    Rejoindre
                  </button>
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={async () => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette partie ?')) {
                        try {
                          const result = await GameService.deleteGame(game.id);
                          if (result.success) {
                              // Rafraîchir l'historique des parties
                              const updatedGames = await UserService.getUserGames(userData.id);
                              if (updatedGames.success) {
                                  setGameHistory(updatedGames.data);
                              }
                          } else {
                              alert(result.error || 'Erreur lors de la suppression');
                          }
                      } catch (error) {
                          console.error('Erreur lors de la suppression:', error);
                          alert('Erreur lors de la suppression de la partie');
                      }
                  }
              }}
          >
                    Supprimer
                  </button>
                </div>
              )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="4" className="text-center text-base-content">
        Pas encore de parties jouées
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;