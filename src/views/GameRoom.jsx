import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import GameService from '../services/GameService';

const socket = io('http://localhost:3000');

const CreateGame = () => {
  const [gameState, setGameState] = useState(() => {
    // Try to load saved state from localStorage
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved) : {
      roomId: '',
      isCreator: false,
      playerCount: 1,
      canStart: false,
      joinedPlayer: null
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (gameState.roomId) {
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [gameState]);

  const createRoom = async () => {
    const result = await GameService.createGame();
    if (result.success) {
      const gameId = result.data.gameId;
      const newState = {
        roomId: gameId,
        isCreator: true,
        playerCount: 1,
        canStart: false,
        joinedPlayer: null
      };
      setGameState(newState);
      socket.emit('createRoom', gameId);
    } else {
      console.error(result.error);
    }
  };

  useEffect(() => {
    // When a player joins the room
    socket.on('playerJoined', (data) => {
      setGameState(prev => ({
        ...prev,
        playerCount: prev.playerCount + 1,
        canStart: true,
        joinedPlayer: data.username  // Add the joined player's username
      }));
    });

    // Cleanup function
    return () => {
      socket.off('playerJoined');
    };
  }, []);

  // Function to start the game
  const handleStartGame = async () => {
    if (gameState.canStart) {
      const result = await GameService.startGame(gameState.roomId);
      if (result.success) {
        socket.emit('startGame', gameState.roomId);
        // Clear game state from localStorage when starting
        localStorage.removeItem('gameState');
      }
    }
  };

  // Clear local storage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('gameState');
    };
  }, []);

  if (!gameState.roomId) {
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
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Ta partie a été créée ! 🎮</h2>
        <p className="text-base-content">Envoie ce game id à ton ami pour qu'il rejoigne la partie !</p>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-base-300 rounded-lg p-4 flex items-center gap-2">
            <code className="text-base-content text-lg font-mono">
              {gameState.roomId}
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(gameState.roomId);
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
        <div className="mt-8">
          {gameState.joinedPlayer ? (
            <>
              <p className="text-base-content">
                Le joueur <span className="font-bold">{gameState.joinedPlayer}</span> a rejoint la partie
              </p>
              <button 
                onClick={handleStartGame}
                className="btn btn-success mt-4"
              >
                Lancer la partie !
              </button>
            </>
          ) : (
            <p className="text-base-content">En attente du collègue...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const JoinGame = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const joinRoom = async () => {
    const result = await GameService.joinGame(roomId);
    if (result.success) {
      // Get the current user's username from localStorage or context
      const username = localStorage.getItem('username');
      socket.emit('joinRoom', { roomId, username });
      
      // Save joined game state
      const gameState = {
        roomId,
        isCreator: false,
        playerCount: 2,
        waiting: true
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
      
      navigate(`/game/${roomId}/play`);
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Rejoindre une partie</h2>
        <input
          type="text"
          placeholder="Entre le Game ID"
          className="input input-bordered w-full max-w-xs text-base-content"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button 
          onClick={joinRoom}
          className="btn btn-primary"
        >
          Rejoindre
        </button>
      </div>
    </div>
  );
};

const GameRoom = () => {
  return (
    <Routes>
      <Route path="/create" element={<CreateGame />} />
      <Route path="/join" element={<JoinGame />} />
    </Routes>
  );
};

export default GameRoom;