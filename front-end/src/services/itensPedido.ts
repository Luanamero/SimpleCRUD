import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ItemPedido {
  id?: number;
  pedido_id: number;
  livro_id: number;
  quantidade: number;
  preco_unitario: number;
}

export const ItemPedidoService = {
  async listar(): Promise<ItemPedido[]> {
    const response = await api.get('/itens-pedido/');
    return response.data;
  },

  async obter(id: number): Promise<ItemPedido> {
    const response = await api.get(`/itens-pedido/${id}`);
    return response.data;
  },

  async criar(item: Omit<ItemPedido, 'id'>): Promise<ItemPedido> {
    const response = await api.post('/itens-pedido/', item);
    return response.data.data;
  },

  async atualizar(id: number, item: Partial<ItemPedido>): Promise<ItemPedido> {
    const response = await api.put(`/itens-pedido/${id}`, item);
    return response.data.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/itens-pedido/${id}`);
  },
};

// React Query hooks
export const useItensPedido = () => {
  return useQuery({
    queryKey: ['itensPedido'],
    queryFn: () => ItemPedidoService.listar(),
  });
};

export const useItensPedidoByPedidoId = (pedidoId: number) => {
  return useQuery({
    queryKey: ['itensPedido', { pedidoId }],
    queryFn: async () => {
      const response = await api.get(`/itens-pedido/pedido/${pedidoId}`);
      return response.data;
    },
    enabled: !!pedidoId,
  });
};

export const useItemPedido = (id: number) => {
  return useQuery({
    queryKey: ['itemPedido', id],
    queryFn: () => ItemPedidoService.obter(id),
    enabled: !!id,
  });
};

export const useCreateItemPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: Omit<ItemPedido, 'id'>) => ItemPedidoService.criar(item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itensPedido'] });
      queryClient.invalidateQueries({ queryKey: ['itensPedido', { pedidoId: variables.pedido_id }] });
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedido_id] });
    },
  });
};

export const useUpdateItemPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, item }: { id: number; item: Partial<ItemPedido> }) => 
      ItemPedidoService.atualizar(id, item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itensPedido'] });
      if (variables.item.pedido_id) {
        queryClient.invalidateQueries({ queryKey: ['itensPedido', { pedidoId: variables.item.pedido_id }] });
        queryClient.invalidateQueries({ queryKey: ['pedido', variables.item.pedido_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['itemPedido', variables.id] });
    },
  });
};

export const useDeleteItemPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ItemPedidoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itensPedido'] });
    },
  });
};