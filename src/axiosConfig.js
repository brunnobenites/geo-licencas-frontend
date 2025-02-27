import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // URL base do seu backend FastAPI
  timeout: 10000, // Tempo limite de 10 segundos
});

export default axiosInstance;
