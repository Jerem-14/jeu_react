import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// useGameSocket.js
export const useGameSocket = (gameId, onGameUpdate) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    socket.current.on('gameState', (newGameState) => {
      onGameUpdate(newGameState);
    });

    socket.current.emit('joinGameRoom', { gameId });

    return () => {
      socket.current.disconnect();
    };
  }, [gameId, onGameUpdate]);

  const emitMove = (move) => {
    socket.current.emit('playerMove', {
      gameId,
      playerId: localStorage.getItem('userId'),
      ...move
    });
  };

  return { emitMove };
};