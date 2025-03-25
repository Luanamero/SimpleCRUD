import { api } from './api';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
}

export const ClienteService = {
  async listar(): Promise<Cliente[]> {
    const response = await api.get('/clientes/');
    return response.data;
  },

  async obter(id: number): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async criar(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await api.post('/clientes/', cliente);
    return response.data;
  },

  async atualizar(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};