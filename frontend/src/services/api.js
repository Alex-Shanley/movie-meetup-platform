import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Authentication APIs
export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  logout: (refreshToken) => api.post('/accounts/logout/', { refresh_token: refreshToken }),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.patch('/accounts/profile/', data),
};

// Movie APIs
export const movieAPI = {
  getAll: (params) => api.get('/movies/', { params }),
  getOne: (id) => api.get(`/movies/${id}/`),
  searchTMDB: (query) => api.get('/movies/tmdb/search/', { params: { q: query } }),
  getPopular: (page = 1) => api.get('/movies/tmdb/popular/', { params: { page } }),
  getTMDBDetails: (tmdbId) => api.get(`/movies/tmdb/${tmdbId}/`),
  getTMDBRecommendations: (tmdbId, page = 1) =>
    api.get(`/movies/tmdb/${tmdbId}/recommendations/`, { params: { page } }),
  getTMDBReviews: (tmdbId, page = 1) =>
    api.get(`/movies/tmdb/${tmdbId}/reviews/`, { params: { page } }),
  create: (data) => api.post('/movies/', data),
  update: (id, data) => api.patch(`/movies/${id}/`, data),
  delete: (id) => api.delete(`/movies/${id}/`),
  rate: (data) => api.post('/movies/ratings/', data),
  getRatings: (movieId) => api.get('/movies/ratings/', { params: { movie: movieId } }),
  getFavorites: () => api.get('/movies/favorites/'),
  addFavorite: (movieId) => api.post('/movies/favorites/', { movie_id: movieId }),
  removeFavorite: (movieId) => api.delete('/movies/favorites/remove/', { data: { movie_id: movieId } }),
};

// Meetup APIs
export const meetupAPI = {
  getAll: (params) => api.get('/meetups/', { params }),
  getOne: (id) => api.get(`/meetups/${id}/`),
  create: (data) => api.post('/meetups/', data),
  update: (id, data) => api.patch(`/meetups/${id}/`, data),
  delete: (id) => api.delete(`/meetups/${id}/`),
  join: (id, message) => api.post(`/meetups/${id}/join/`, { message }),
  leave: (id) => api.post(`/meetups/${id}/leave/`),
  getParticipants: (id) => api.get(`/meetups/${id}/participants/`),
  addComment: (id, text) => api.post(`/meetups/${id}/comment/`, { text }),
  getComments: (id) => api.get(`/meetups/${id}/comments/`),
};
