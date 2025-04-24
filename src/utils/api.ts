import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.nucleav.com'; // URL de tu backend en Railway

export const api = axios.create({
  baseURL: API_URL || "https://localhost:5000",
  withCredentials: false, // Si usas autenticación con cookies o JWT
});
