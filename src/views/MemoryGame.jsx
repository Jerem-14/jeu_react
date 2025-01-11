// views/MemoryGame/index.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import GameBoard from '../components/organismes/GameBord';

const MemoryGame = () => {
    const { gameId } = useParams();
    const { gameState, flipCard, isCurrentPlayer, error } = useGameState(gameId);

    if (!gameState) {
        return <div>Chargement...</div>;
    }

    const handleCardClick = (cardIndex) => {
        if (!isCurrentPlayer()) {
            console.log("Ce n'est pas votre tour");
            return;
        }
        flipCard(cardIndex);
    };

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
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