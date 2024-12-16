import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import GameService from '../services/GameService';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket']
});

// Initial page with create/join buttons
const GameChoice = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex gap-4 items-center">
        <button 
          onClick={() => navigate('/game/create')}
          className="btn btn-primary"
        >
          Créer une partie
        </button>
        <span className="text-base-content">ou</span>
        <button 
          onClick={() => navigate('/game/join')}
          className="btn btn-outline btn-primary"
        >
          Rejoindre une partie
        </button>
      </div>
    </div>
  );
};

// Create Game View
const CreateGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    gameId: '',
    playerJoined: false,
    joinedPlayerName: ''
  });

  useEffect(() => {
    socket.on('playerJoined', (data) => {
      setGameState(prev => ({
        ...prev,
        playerJoined: true,
        joinedPlayerName: data.userId
      }));
    });

    return () => {
      socket.off('playerJoined');
    };
  }, []);

  const createRoom = async () => {
    try {
      const result = await GameService.createGame();
      if (result.success) {
        const gameId = result.data.gameId;
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        socket.emit('createRoom', gameId, userId, username);
        setGameState(prev => ({ ...prev, gameId }));
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const startGame = () => {
    socket.emit('initiateGameStart', gameState.gameId);
  };

  if (!gameState.gameId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <button 
          onClick={createRoom}
          className="btn btn-primary"
        >
          Créer une partie
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Ta partie a été créée ! 🎮</h2>
        <p className="text-base-content">
          Envoi ce game id à ton ami pour qu'il rejoigne la partie !
        </p>
        
        <div className="flex flex-col items-center gap-2">
            <div className="bg-base-300 rounded-lg p-4 flex items-center gap-2">
              <code className="text-base-content text-lg font-mono">
                {gameState.gameId}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(gameState.gameId);
                  document.getElementById('copy-toast').classList.remove('hidden');
                  setTimeout(() => {
                    document.getElementById('copy-toast').classList.add('hidden');
                  }, 2000);
                }}
                className="btn btn-primary btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
            <div id="copy-toast" className="toast toast-top toast-center hidden">
              <div className="alert alert-success">
                <span>Code copié!</span>
              </div>
            </div>
            </div>


        {gameState.playerJoined ? (
          <div className="space-y-4">
            <div className="alert alert-success">
              Le joueur {gameState.joinedPlayerName} a rejoint la partie !
            </div>
            <button 
              onClick={startGame}
              className="btn btn-success"
            >
              Lancer la partie !
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center text-primary">
            <span>En attente du collègue</span>
            <div className="loading loading-spinner loading-sm"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Join Game View
const JoinGame = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState('');
  const [joinState, setJoinState] = useState('initial'); // initial, waiting, starting

  useEffect(() => {
    socket.on('gameStarting', () => {
      setJoinState('starting');
      setTimeout(() => {
        navigate(`/game/${gameId}/play`);
      }, 4000);
    });

    return () => {
      socket.off('gameStarting');
    };
  }, [gameId, navigate]);

  const joinRoom = async () => {
    try {
      const result = await GameService.joinGame(gameId);
      if (result.success) {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');

        socket.emit('joinRoom', { 
          roomId: gameId, 
          username, 
          userId 
        });
        
        setJoinState('waiting');
      }
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  if (joinState === 'starting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Tu as rejoint la partie !</h2>
          <p className="italic">
            La partie a démarré ! Le jeu va se lancer dans 4 secondes...
          </p>
        </div>
      </div>
    );
  }

  if (joinState === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Tu as rejoint la partie !</h2>
          <p className="italic">
            La partie est pleine, veuillez patienter le temps que le créateur la lance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Rejoins une partie ✌️</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ID du jeu"
              className="input input-bordered flex-1"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
            <button 
              onClick={joinRoom}
              className="btn btn-primary"
            >
              Rejoindre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Game Component
const Game = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Memory Game</h2>
          <div className="bg-base-200 h-64 flex items-center justify-center">
            Game Interface Coming Soon!
          </div>
        </div>
      </div>
    </div>
  );
};

const GameRoom = () => {
  return (
    <Routes>
      <Route path="/" element={<GameChoice />} />
      <Route path="/create" element={<CreateGame />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/:gameId/play" element={<Game />} />
    </Routes>
  );
};

export default GameRoom;