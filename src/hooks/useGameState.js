import { useState, useCallback } from 'react';
import MediaService from '../services/MediaService';

export const useGameState = (initialState) => {
  const [gameState, setGameState] = useState({
    cards: [], // tableau des cartes
    players: [], // infos des joueurs
    currentTurn: null, // joueur actif
    selectedCards: [], // cartes retournées
    scores: {}, // scores des joueurs
    isLoading: true,
    error: null,
    ...initialState
  });

  const isCurrentPlayer = useCallback(() => {
    const userId = localStorage.getItem('userId');
    return gameState.currentTurn === userId;
  }, [gameState.currentTurn]);

  // Initialisation du jeu avec les médias
  const initializeGame = useCallback(async (gameId) => {
    try {
      const mediaResult = await MediaService.getMedia();
      if (mediaResult.success) {
        const shuffledCards = prepareGameCards(mediaResult.data);
        const userId = localStorage.getItem('userId');
        
        // Récupérer les informations du deuxième joueur via le socket
        // Pour l'instant, on simule avec un joueur unique
        const players = [
          { id: userId, username: localStorage.getItem('username'), score: 0, isActive: true }
        ];

        setGameState(prev => ({
          ...prev,
          cards: shuffledCards,
          players: players,
          currentTurn: userId,
          scores: { [userId]: 0 },
          isLoading: false
        }));
      }
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: 'Erreur lors de l\'initialisation du jeu',
        isLoading: false
      }));
    }
  }, []);

  // Préparation des cartes
  const prepareGameCards = (mediaList) => {
    const selectedMedia = mediaList.slice(0, 32);
    const pairs = [...selectedMedia, ...selectedMedia].map((media, index) => ({
      id: index,
      mediaId: media.id,
      url: media.url,
      type: media.type,
      isFlipped: false,
      isMatched: false
    }));
    return shuffleArray(pairs);
  };

  // Mélange des cartes
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Gestion du retournement d'une carte
  const flipCard = useCallback((cardIndex) => {
    if (!isCurrentPlayer()) {
      console.log("Ce n'est pas votre tour!");
      return;
    }

    setGameState(prev => {
      if (prev.selectedCards.length >= 2 || prev.cards[cardIndex].isMatched) {
        return prev;
      }

      const newCards = [...prev.cards];
      newCards[cardIndex] = {
        ...newCards[cardIndex],
        isFlipped: true
      };

      const newSelectedCards = [...prev.selectedCards, cardIndex];

      if (newSelectedCards.length === 2) {
        const [card1, card2] = newSelectedCards;
        
        if (newCards[card1].mediaId === newCards[card2].mediaId) {
          // Paire trouvée
          newCards[card1].isMatched = true;
          newCards[card2].isMatched = true;
          
          return {
            ...prev,
            cards: newCards,
            scores: {
              ...prev.scores,
              [prev.currentTurn]: prev.scores[prev.currentTurn] + 1
            },
            selectedCards: []
          };
        }

        // Pas une paire - retourner les cartes après un délai
        setTimeout(() => {
          setGameState(prevState => {
            const updatedCards = prevState.cards.map((card, idx) => 
              idx === card1 || idx === card2 
                ? { ...card, isFlipped: false }
                : card
            );

            // Changer de tour
            const currentPlayerIndex = prevState.players.findIndex(p => p.id === prevState.currentTurn);
            const nextPlayerIndex = (currentPlayerIndex + 1) % prevState.players.length;
            const nextPlayerId = prevState.players[nextPlayerIndex].id;

            return {
              ...prevState,
              cards: updatedCards,
              currentTurn: nextPlayerId,
              selectedCards: []
            };
          });
        }, 1000);
      }

      return {
        ...prev,
        cards: newCards,
        selectedCards: newSelectedCards
      };
    });
  }, [isCurrentPlayer]);

  return {
    gameState,
    isCurrentPlayer,
    flipCard,
    initializeGame
  };
};