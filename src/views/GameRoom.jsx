import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import GameService from '../services/GameService';
import MemoryGame from '../views/MemoryGame';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket']
});


// Game states enum for better state management
const GAME_STATES = {
  INITIAL: 'initial',
  WAITING: 'waiting',
  STARTING: 'starting',
  PLAYING: 'playing'
};

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
    joinedPlayerName: '',
    gameStatus: GAME_STATES.INITIAL
  });

  useEffect(() => {
    socket.on('playerJoined', (data) => {
      setGameState(prev => ({
        ...prev,
        playerJoined: true,
        joinedPlayerName: data.userId,
        gameStatus: GAME_STATES.WAITING
      }));
    });

    // Handle game start confirmation
    socket.on('gameStartConfirmed', ({ gameId }) => {
      setGameState(prev => ({
        ...prev,
        gameStatus: GAME_STATES.STARTING
      }));
      
      // Navigate to game session after a brief delay
      setTimeout(() => {
        navigate(`/game/${gameId}/play`);
      }, 4000);
    });

    return () => {
      socket.off('playerJoined');
      socket.off('gameStartConfirmed');
    };
  }, [navigate]);

  const createRoom = async () => {
    try {
      const result = await GameService.createGame();
      if (result.success) {
        const gameId = result.data.gameId;
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        socket.emit('createRoom', gameId, userId, username);
        setGameState(prev => ({ ...prev, gameId, gameStatus: GAME_STATES.WAITING  }));
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const startGame = async () => {
    try {
      console.log("Starting game...");
      const result = await GameService.updateGameState(gameState.gameId, 'start');
      console.log("Update game state result:", result);
      
      if (result.success) {
        
        socket.emit('initiateGameStart', {
          gameId: gameState.gameId
        });
        
        setGameState(prev => ({
          ...prev,
          gameStatus: GAME_STATES.STARTING
        }));
        
        setTimeout(() => {
          console.log("Navigating to game...");
          navigate(`/game/${gameState.gameId}/play`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  if (gameState.gameStatus === GAME_STATES.STARTING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">La partie démarre !</h2>
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

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
  const [gameStatus, setGameStatus] = useState(GAME_STATES.INITIAL); // initial, waiting, starting

  useEffect(() => {
    console.log("Setting up gameStartConfirmed listener");
    
    socket.on('gameStartConfirmed', (data) => {
      console.log("Received gameStartConfirmed:", data);
      setGameStatus(GAME_STATES.STARTING);
      setTimeout(() => {
        console.log("Navigating to game play");
        navigate(`/game/${data.gameId}/play`);
      }, 4000); 
    });
  
    return () => {
      console.log("Cleaning up gameStartConfirmed listener");
      socket.off('gameStartConfirmed');
    };
  }, [navigate]);

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
        
        setGameStatus(GAME_STATES.WAITING);
      }
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  if (gameStatus === GAME_STATES.STARTING) {
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

  if (gameStatus === GAME_STATES.WAITING) {
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
/* const Game = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    console.log("Game component mounted with gameId:", gameId);
    
    socket.on('gameUpdate', (updatedState) => {
      console.log("Received game update:", updatedState);
      setGameState(updatedState);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, [gameId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Memory Game</h2>
          <div className="bg-base-200 h-64 flex items-center justify-center">
            <div>Game ID: {gameId}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; */

const GameRoom = () => {
  return (
    <Routes>
      <Route path="/" element={<GameChoice />} />
      <Route path="/create" element={<CreateGame />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/:gameId/play" element={<MemoryGame  />} />
    </Routes>
  );
};

export default GameRoom;