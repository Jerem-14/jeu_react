// useGameState.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

export const useGameState = (gameId) => {
    // Initialise avec un état par défaut plus sûr
    const [gameState, setGameState] = useState({
        cards: [],
        players: {},
        currentTurn: '',  // String vide par défaut
        status: 'waiting',
        error: null
    });

    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:3000', {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            cors: {
                origin: "http://localhost:5173",
                credentials: true
            }
        });

        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (gameId) {
            socket.current.emit('joinGame', {
                gameId,
                player: { id: userId, username }
            });
        }

        socket.current.on('gameStateUpdate', (newState) => {
            console.log('Nouvel état reçu:', newState); // Debug
            setGameState(newState);
        });

        socket.current.on('gameError', ({ message }) => {
            console.error('Erreur reçue:', message); // Debug
            setGameState(prev => ({ ...prev, error: message }));
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [gameId]);

    const flipCard = useCallback((cardIndex) => {
        const userId = localStorage.getItem('userId');
        console.log('Émission de flipCard:', { gameId, playerId: userId, cardIndex });
        if (socket.current) {
            socket.current.emit('flipCard', {
                gameId,
                playerId: userId,
                cardIndex
            });
        }
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
        gameState,
        flipCard,
        isCurrentPlayer,
        error: gameState?.error
    };
};