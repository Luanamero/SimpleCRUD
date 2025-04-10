import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    return response.data.data;
  },

  async atualizar(id: number, editora: Partial<Editora>): Promise<Editora> {
    const response = await api.put(`/editoras/${id}`, editora);
    return response.data.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/editoras/${id}`);
  },
};

// React Query hooks
export const useEditoras = () => {
  return useQuery({
    queryKey: ['editoras'],
    queryFn: () => EditoraService.listar(),
  });
};

export const useEditora = (id: number) => {
  return useQuery({
    queryKey: ['editora', id],
    queryFn: () => EditoraService.obter(id),
    enabled: !!id,
  });
};

export const useCreateEditora = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (editora: Omit<Editora, 'id'>) => EditoraService.criar(editora),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editoras'] });
    },
  });
};

export const useUpdateEditora = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, editora }: { id: number; editora: Partial<Editora> }) => 
      EditoraService.atualizar(id, editora),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['editoras'] });
      queryClient.invalidateQueries({ queryKey: ['editora', variables.id] });
    },
  });
};

export const useDeleteEditora = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => EditoraService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editoras'] });
    },
  });
};