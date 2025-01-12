// views/MemoryGame/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import GameBoard from '../components/organismes/GameBord';
import GameService from '../services/GameService';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    path: '/socket.io/',
      transports: ['websocket', 'polling'],
      cors: {
          origin: "http://localhost:5173",
          credentials: true
      }
  });

const GameOverModal = ({ gameState, onPlayAgain, onQuit }) => {
    if (!gameState.status || gameState.status !== 'finished') return null;

    const currentPlayerId = localStorage.getItem('userId');
    const isWinner = gameState.winners?.some(winner => winner.id === currentPlayerId);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {gameState.isDraw ? "Match nul !" : (isWinner ? "Victoire !" : "Défaite...")}
                </h2>
                
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Scores finaux :</h3>
                    {Object.values(gameState.players).map((player) => (
                        <div key={player.id} className="flex justify-between items-center mb-2">
                            <span>{player.id}</span>
                            <span className="font-bold">{player.score} paires</span>
                        </div>
                    ))}
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={onPlayAgain}
                        className="btn btn-primary flex-1"
                    >
                        Nouvelle Partie
                    </button>
                    <button 
                        onClick={onQuit}
                        className="btn btn-outline flex-1"
                    >
                        Menu Principal
                    </button>
                </div>
            </div>
        </div>
    );
};

const MemoryGame = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { gameState, flipCard, isCurrentPlayer, error } = useGameState(gameId);


    const handleCardClick = (cardIndex) => {
         // Vérifions d'abord que gameState et cards existent
         if (!gameState || !gameState.cards || !gameState.cards[cardIndex]) {
            console.log("État du jeu non disponible");
            return;
        }
        
        if (!isCurrentPlayer() || gameState.cards[cardIndex].isFlipped === true) {
            console.log("Ce n'est pas votre tour carte déjà retournée");
            return;
        }
        console.log("Tentative de retourner la carte:", cardIndex);
        flipCard(cardIndex);
    };

    const handlePlayAgain = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');
            
            if (!userId || !username) {
                console.error('Informations utilisateur manquantes');
                return;
            }

            const result = await GameService.createGame();
            if (result.success) {
                const newGameId = result.data.gameId;
                
                socket.emit('createGame', {
                    gameId: newGameId,
                    creator: {
                        id: userId,
                        username
                    }
                });

                navigate('/game/create');
            }
        } catch (error) {
            console.error('Erreur création nouvelle partie:', error);
        }
    };

    const handleQuit = () => {
        navigate('/'); // Retour à l'accueil
    };


    return (
        <div className="container mx-auto p-4">
             {error && (
                <div className="alert alert-error">{error}</div>
            )}
            {!isCurrentPlayer() && (
                <div className="alert alert-warning">
                    En attente du tour de l'autre joueur...
                </div>
            )}
            <GameBoard 
                gameState={gameState}
                onMove={handleCardClick}
            />
             <GameOverModal 
                gameState={gameState}
                onPlayAgain={handlePlayAgain}
                onQuit={handleQuit}
            />
        </div>
    );
};

export default MemoryGame;