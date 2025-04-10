import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// API function implementations
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
    return response.data.data;
  },

  async atualizar(id: number, livro: Partial<Livro>): Promise<Livro> {
    const response = await api.put(`/livros/${id}`, livro);
    return response.data.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/livros/${id}`);
  },
};

// React Query hooks
export const useLivros = () => {
  return useQuery({
    queryKey: ['livros'],
    queryFn: () => LivroService.listar(),
  });
};

export const useLivro = (id: number) => {
  return useQuery({
    queryKey: ['livro', id],
    queryFn: () => LivroService.obter(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};

export const useCreateLivro = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (livro: Omit<Livro, 'id'>) => LivroService.criar(livro),
    onSuccess: () => {
      // Invalidate the livros query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['livros'] });
    },
  });
};

export const useUpdateLivro = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, livro }: { id: number; livro: Partial<Livro> }) => 
      LivroService.atualizar(id, livro),
    onSuccess: (_, variables) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      queryClient.invalidateQueries({ queryKey: ['livro', variables.id] });
    },
  });
};

export const useDeleteLivro = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => LivroService.excluir(id),
    onSuccess: () => {
      // Invalidate the livros query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['livros'] });
    },
  });
};