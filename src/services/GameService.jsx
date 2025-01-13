// src/services/GameService.jsx
import axios from 'axios';

const API_URL = "http://localhost:3000";

class GameService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add token to requests
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async createGame() {
        try {
            const userId = localStorage.getItem('userId');
            const response = await this.api.post('/game', { userId });
            return { 
                success: true, 
                data: response.data 
            };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Error creating game'
            };
        }
    }

    async joinGame(gameId) {
        try {
            const userId = localStorage.getItem('userId');
            const response = await this.api.patch(`/game/join/${gameId}`, { userId });
            return { 
                success: true, 
                data: response.data 
            };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Error joining game'
            };
        }
    }
// Dans GameService.jsx
async updateGameState(gameId, action) {
    try {
      const response = await this.api.patch(`/game/${action}/${gameId}`, {
        userId: localStorage.getItem('userId')
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error updating game'
      };
    }
  }

  // Dans GameService.jsx, ajouter cette méthode
async createRematch(previousGameState) {
    try {
        const userId = localStorage.getItem('userId');
        const response = await this.api.post('/game', { userId });
        
        if (response.data.gameId) {
            return { 
                success: true, 
                data: {
                    gameId: response.data.gameId,
                    players: previousGameState.players // On conserve les joueurs
                }
            };
        }
        return { 
            success: false, 
            error: 'Erreur lors de la création de la revanche'
        };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.error || 'Error creating rematch game'
        };
    }
}

  
}

export default new GameService();