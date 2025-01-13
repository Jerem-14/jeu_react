import React, { useState, useEffect } from 'react';
import { Trophy, User, Mail, GamepadIcon, Award } from 'lucide-react';
import UserService from '../services/UserService';

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
    bestScore: 0
  });

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      console.log("Starting to load user data with token:", token);
      
      if (token) {
        try {
          // Decode JWT token
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          console.log("Decoded token:", decodedToken);
          
          if (decodedToken.id) {
            // 1. Fetch user data
            const userResponse = await UserService.getUserById(decodedToken.id);
            if (userResponse.success) {
              setUserData(userResponse.data);
              
              // 2. Fetch games history
              const gamesResponse = await UserService.getUserGames(decodedToken.id);
              console.log("Games response:", gamesResponse);
              if (gamesResponse.success) {
                setGameHistory(gamesResponse.data);
              }
  
              // 3. Fetch stats separately
              const statsResponse = await UserService.getGameStats(decodedToken.id);
              console.log("Stats response:", statsResponse);
              if (statsResponse.success) {
                setGameStats(statsResponse.data);
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

  console.log("Current state - userData:", userData);
  console.log("Current state - gameHistory:", gameHistory);
  console.log("Current state - gameStats:", gameStats);

  if (!userData) {
    console.log("Rendering loading state");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  console.log("Loading state triggered:", {
    token: localStorage.getItem('token'),
    userData: userData,
    isLoading: !userData
  });

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
              <div className="stat-value text-primary">{userData.bestScore || 0}</div>
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
                </tr>
              </thead>
              <tbody>
  {gameHistory?.data && gameHistory.data.length > 0 ? (
    gameHistory.data.map((game) => {
      // Determine l'adversaire
      const opponent = game.creator === userData.id 
        ? game.player2?.username 
        : game.player1?.username;

      // Determine le résultat et sa classe CSS
      let result, resultClass;
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
      }

      return (
        <tr key={game.id}>
          <td>{new Date(game.createdAt).toLocaleDateString('fr-FR')}</td>
          <td>{opponent || 'En attente...'}</td>
          <td className={resultClass}>{result}</td>
          <td>{game.winnerScore || '-'}</td>
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