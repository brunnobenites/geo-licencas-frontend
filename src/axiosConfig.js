// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mapcg.onrender.com/', // Usa .env ou fallback
  timeout: 10000, // Tempo limite de 10 segundos
});

export default axiosInstance;