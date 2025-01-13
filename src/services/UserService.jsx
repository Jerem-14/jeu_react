import axios from 'axios';

const API_URL = "http://localhost:3000";

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Intercepteur pour ajouter le token aux requêtes
        this.api.interceptors.request.use((config) => {
            const token = this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    // Méthode pour sauvegarder le token dans le localStorage
    setToken(token) {
        localStorage.setItem('token', token);
    }

    // Méthode pour récupérer le token du localStorage
    getToken() {
        return localStorage.getItem('token');
    }

    // Méthode pour supprimer le token du localStorage
    removeToken() {
        localStorage.removeItem('token');
    }

    // Méthode pour vérifier si l'utilisateur est authentifié
    isAuthenticated() {
        return !!this.getToken();
    }

    // Méthode pour se connecter
    async login({email, password}) {
        try {
            const response = await this.api.post('/login', { email, password });
            if (response.data.data.token) {
                this.setToken(response.data.data.token);
                localStorage.setItem('username', response.data.data.username);
                localStorage.setItem('userId', response.data.data.userId);
                return { success: true, 
                    data: response.data.data };
            }
            return { success: false, error: response.data.error || 'Login failed' };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Une erreur est survenue'
            };
        }
    }

    // Méthode pour s'inscrire
    async register(userData) {
        try {
          const response = await this.api.post('/register', userData);
          console.log("Response data: ", response.data);
          if (response.data.error) {
            return { success: false, error: response.data.error };
          }
          return { success: true, data: response.data };
        } catch (error) {
          console.error("Registration error: ", error); // Log the error
          return { 
            success: false, 
            error: error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription'
          };
        }
      }

    // Méthode pour se déconnecter
    async logout() {
        try {
            await this.api.post('/logout');
            this.removeToken();
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: 'Erreur lors de la déconnexion'
            };
        }
    }

    // Méthode pour récupérer la liste des utilisateurs
    async getUsers() {
        try {
            const response = await this.api.get('/users');
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error || 'Erreur lors de la récupération des utilisateurs'
            };
        }
    }

    // Méthode pour récupérer un utilisateur par son ID
    async getUserById(id) {
        try {
            const response = await this.api.get(`/users/${id}`);
            console.log("User data response:", response);
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error fetching user:", error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erreur lors de la récupération de l\'utilisateur'
            };
        }
    }

    async getGameStats(userId) {
        try {
          const response = await this.api.get(`/users/${userId}/stats`);
          return { success: true, data: response.data };
        } catch (error) {
          return { 
            success: false, 
            error: 'Error fetching game statistics'
          };
        }
    }

    async getUserGames(userId) {
        try {
          const response = await this.api.get(`/users/${userId}/games`);
          console.log("Games API response:", response);
          return { success: true, data: response.data };
        } catch (error) {
          console.error("Error fetching games:", error);
          return { 
            success: false, 
            error: error.response?.data?.error || 'Error fetching game history'
          };
        }
    }

    async getGameStats(userId) {
        try {
            const response = await this.api.get(`/users/${userId}/stats`);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: 'Error fetching game statistics'
            };
        }
    }
    async updateUser(userId, userData) {
        try {
            const response = await this.api.patch(`/users/${userId}`, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Error updating user'
            };
        }
    }
}

export default new UserService();