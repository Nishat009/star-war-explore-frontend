import axios from 'axios';

const API_BASE_URL = 'https://sw-be.onrender.com/api/';

export const getCharacters = async (page = 1, search = '') => {
  const response = await axios.get(`${API_BASE_URL}/characters`, {
    params: { page, search }
  });
  return response.data;
};
