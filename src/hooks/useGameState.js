// useGameState.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { config } from '../config/config';



export const useGameState = (gameId) => {
    
    const [gameState, setGameState] = useState({
        cards: [],
        players: {},
        currentTurn: '',
        status: 'waiting',
        error: null
    });

    const transformedGameState = {
        ...gameState,
        currentTurn: gameState.players[gameState.currentTurn]?.username || gameState.currentTurn
    };
    const [rematchRequest, setRematchRequest] = useState(null);

    const socket = useRef(null);

    useEffect(() => {
        socket.current = io(config.apiUrl, {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            cors: {
                origin: config.clientUrl,
                credentials: true
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            autoConnect: true,
            withCredentials: true
        });

        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (gameId) {
            socket.current.emit('joinGame', {
                gameId,
                player: { id: userId, username }
            });
        }

        // Essayer de rejoindre la partie existante
        if (gameId && userId) {
            socket.current.emit('rejoinGame', { gameId, userId });
        }

        socket.current.on('gameStateUpdate', (newState) => {
            console.log('Nouvel état reçu:', newState); // Debug
            setGameState(newState);
        });

        socket.current.on('gameError', ({ message }) => {
            console.error('Erreur reçue:', message); // Debug
            setGameState(prev => ({ ...prev, error: message }));
        });

        // Ajouter les écouteurs pour la revanche
        socket.current.on('rematchRequested', (data) => {
          console.log('Demande de revanche reçue:', data);
          setRematchRequest(data);
      });

      socket.current.on('rematchAccepted', (data) => {
          console.log('Revanche acceptée:', data);
          setRematchRequest(null);
      });

      socket.current.on('rematchDeclined', () => {
          console.log('Revanche refusée');
          setRematchRequest(null);
      });

      socket.current.on('connect', () => {
        // Essayer de rejoindre à nouveau après une reconnexion
        if (gameId && userId) {
            socket.current.emit('rejoinGame', { gameId, userId });
        }
    });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [gameId]);

    const flipCard = useCallback((cardIndex) => {
        const userId = localStorage.getItem('userId');
        console.log('État actuel du jeu:', gameState);
        console.log('Émission de flipCard:', { gameId, playerId: userId, cardIndex });
        if (socket.current) {
            socket.current.emit('flipCard', {
                gameId,
                playerId: userId,
                cardIndex
            });
        }
    }, [gameId, gameState]);

    const requestRematch = useCallback(() => {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      console.log('Demande de revanche envoyée');
      socket.current.emit('requestRematch', {
          gameId,
          player: { id: userId, username }
      });
  }, [gameId]);

  const acceptRematch = useCallback(() => {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      console.log('Acceptation de la revanche');
      socket.current.emit('acceptRematch', {
          gameId,
          player: { id: userId, username }
      });
  }, [gameId]);

  const declineRematch = useCallback(() => {
      console.log('Refus de la revanche');
      socket.current.emit('declineRematch', { gameId });
      setRematchRequest(null);
  }, [gameId]);

    const isCurrentPlayer = useCallback(() => {
        // Vérification de sécurité
        if (!gameState || typeof gameState.currentTurn === 'undefined') {
            return false;
        }
        const userId = localStorage.getItem('userId');
        return gameState.currentTurn === userId;
    }, [gameState]);

    return {
        gameState: transformedGameState,
        flipCard,
        isCurrentPlayer,
        error: gameState?.error,
        rematchRequest,
        requestRematch,
        acceptRematch,
        declineRematch
    };
};