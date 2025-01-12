// views/MemoryGame/index.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import GameBoard from '../components/organismes/GameBord';

const MemoryGame = () => {
    const { gameId } = useParams();
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
        </div>
    );
};

export default MemoryGame;