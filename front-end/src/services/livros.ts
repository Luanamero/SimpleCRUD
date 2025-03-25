import { api } from './api';

export interface Livro {
  id?: number;
  titulo: string;
  autor_id: number;
  editora_id: number;
  ano_publicacao: number;
  isbn?: string;
  preco: number;
  estoque: number;
  genero: string;
}

export const LivroService = {
  async listar(): Promise<Livro[]> {
    const response = await api.get('/livros/');
    return response.data;
  },

  async obter(id: number): Promise<Livro> {
    const response = await api.get(`/livros/${id}`);
    return response.data;
  },

  async criar(livro: Omit<Livro, 'id'>): Promise<Livro> {
    const response = await api.post('/livros/', livro);
    return response.data;
  },

  async atualizar(id: number, livro: Partial<Livro>): Promise<Livro> {
    const response = await api.put(`/livros/${id}`, livro);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    console.log("livro",id)
    await api.delete(`/livros/${id}`);
  },
};