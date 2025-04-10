import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Autor {
  id?: number;
  nome: string;
  biografia?: string;
  nacionalidade?: string;
}

export const AutorService = {
  async listar(): Promise<Autor[]> {
    const response = await api.get('/autores/');
    return response.data;
  },

  async obter(id: number): Promise<Autor> {
    const response = await api.get(`/autores/${id}`);
    return response.data;
  },

  async criar(autor: Omit<Autor, 'id'>): Promise<Autor> {
    const response = await api.post('/autores/', autor);
    return response.data.data;
  },

  async atualizar(id: number, autor: Partial<Autor>): Promise<Autor> {
    const response = await api.put(`/autores/${id}`, autor);
    return response.data.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/autores/${id}`);
  },
};

// React Query hooks
export const useAutores = () => {
  return useQuery({
    queryKey: ['autores'],
    queryFn: () => AutorService.listar(),
  });
};

export const useAutor = (id: number) => {
  return useQuery({
    queryKey: ['autor', id],
    queryFn: () => AutorService.obter(id),
    enabled: !!id,
  });
};

export const useCreateAutor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (autor: Omit<Autor, 'id'>) => AutorService.criar(autor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autores'] });
    },
  });
};

export const useUpdateAutor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, autor }: { id: number; autor: Partial<Autor> }) => 
      AutorService.atualizar(id, autor),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['autores'] });
      queryClient.invalidateQueries({ queryKey: ['autor', variables.id] });
    },
  });
};

export const useDeleteAutor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => AutorService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autores'] });
    },
  });
};