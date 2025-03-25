import { api } from './api';

export interface Autor {
  id?: number;
  nome: string;
  biografia?: string;
}

export const AutorService = {
  async listar(): Promise<Autor[]> {
    const response = await api.get('/autores');
    return response.data;
  },

  async obter(id: number): Promise<Autor> {
    const response = await api.get(`/autores/${id}`);
    return response.data;
  },

  async criar(autor: Omit<Autor, 'id'>): Promise<Autor> {
    const response = await api.post('/autores', autor);
    return response.data;
  },

  async atualizar(id: number, autor: Partial<Autor>): Promise<Autor> {
    const response = await api.put(`/autores/${id}`, autor);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/autores/${id}`);
  },
};