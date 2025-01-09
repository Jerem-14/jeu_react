// views/MemoryGame/index.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useGameSocket } from '../hooks/useGameSocket';
import GameBoard from '../components/organismes/GameBord';

const MemoryGame = () => {
  const { gameId } = useParams();
  const { gameState, flipCard, initializeGame, isCurrentPlayer } = useGameState({
    cards: [],
    players: [],
    currentTurn: null,
    scores: {}
  });

  const { emitMove } = useGameSocket(gameId, (moveData) => {
    if (moveData.type === 'cardFlip' && !isCurrentPlayer()) {
      flipCard(moveData.cardIndex);
    }
  });

  useEffect(() => {
    console.log("Game component mounted with gameId:", gameId);
    // Initialiser le jeu au montage
    initializeGame(gameId);
  }, [gameId, initializeGame]);

  const handleCardClick = (cardIndex) => {
    if (!isCurrentPlayer()) {
        return; // Bloquer si ce n'est pas le tour du joueur
      }
    flipCard(cardIndex);
    emitMove({
      type: 'cardFlip',
      cardIndex
    });
  };

  if (gameState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-8">
        {/* En-tête du jeu */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-base-content">Memory Game</h1>
          <p className="text-base-content/70">Game ID: {gameId}</p>
          {!isCurrentPlayer() && (
            <p className="text-warning">En attente du tour de l'autre joueur...</p>
          )}
        </div>

        {/* Plateau de jeu */}
        <GameBoard 
          gameState={gameState}
          onMove={handleCardClick}
          currentPlayerId={localStorage.getItem('userId')}
        />
      </div>
    </div>
  );
};

export default MemoryGame;