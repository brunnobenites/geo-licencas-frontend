import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/licencas/';

export const fetchLicencas = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Licenças buscadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar licenças ambientais', error);
    return [];
  }
};

export const fetchLicencaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`);
    console.log(`Licença ID ${id} buscada:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar licença com ID ${id}`, error);
    return null;
  }
};

export const createLicenca = async (licencaData) => {
  try {
    console.log('Enviando para criar licença:', licencaData);
    const response = await axios.post(API_URL, licencaData);
    console.log('Licença criada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar licença', error);
    return null;
  }
};

export const updateLicenca = async (id, licencaData) => {
  try {
    console.log(`Enviando para atualizar licença ID ${id}:`, licencaData);
    const response = await axios.put(`${API_URL}${id}/`, licencaData);
    console.log(`Licença ID ${id} atualizada:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar licença com ID ${id}`, error);
    return null;
  }
};

export const deleteLicenca = async (id) => {
  try {
    await axios.delete(`${API_URL}${id}/`);
    console.log(`Licença ID ${id} deletada com sucesso`);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar licença com ID ${id}`, error);
    return false;
  }
};