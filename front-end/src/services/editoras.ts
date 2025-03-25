import { api } from './api';

export interface Editora {
  id?: number;
  nome: string;
  endereco?: string;
  telefone?: string;
}

export const EditoraService = {
  async listar(): Promise<Editora[]> {
    const response = await api.get('/editoras/');
    return response.data;
  },

  async obter(id: number): Promise<Editora> {
    const response = await api.get(`/editoras/${id}`);
    return response.data;
  },

  async criar(editora: Omit<Editora, 'id'>): Promise<Editora> {
    const response = await api.post('/editoras/', editora);
    return response.data;
  },

  async atualizar(id: number, editora: Partial<Editora>): Promise<Editora> {
    const response = await api.put(`/editoras/${id}`, editora);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/editoras/${id}`);
  },
};