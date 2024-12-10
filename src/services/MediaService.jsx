import axios from 'axios';

const API_URL = "http://localhost:3000";

class MediaService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async uploadMedia(file, tags) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Just send tags as a simple string
            console.log('Tags before FormData:', tags);
formData.append('tags', tags);
console.log('FormData after append:', Array.from(formData.entries()));
            console.log('Sending formData:', {
                file: file.name,
                tags: tags
            });
            const response = await this.api.post('/api/media', formData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors du téléchargement'
            };
        }
    }

    async getMedia(type = 'all', tags = '') {
        try {
            const params = new URLSearchParams();
            if (type !== 'all') params.append('type', type);
            if (tags) params.append('tags', tags);

            const response = await this.api.get(`/api/media?${params}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la récupération des médias'
            };
        }
    }

    async deleteMedia(id) {
        try {
            await this.api.delete(`/api/media/${id}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la suppression'
            };
        }
    }
}

export default new MediaService();