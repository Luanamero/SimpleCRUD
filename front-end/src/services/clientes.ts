import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  endereco?: string;
  telefone: string;
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
    return response.data.data;
  },

  async atualizar(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};

// React Query hooks
export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => ClienteService.listar(),
  });
};

export const useCliente = (id: number) => {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => ClienteService.obter(id),
    enabled: !!id,
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cliente: Omit<Cliente, 'id'>) => ClienteService.criar(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, cliente }: { id: number; cliente: Partial<Cliente> }) => 
      ClienteService.atualizar(id, cliente),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', variables.id] });
    },
  });
};

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ClienteService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
};