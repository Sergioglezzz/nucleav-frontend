import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.nucleav.com';

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};
