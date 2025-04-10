import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Pedido {
  id?: number;
  cliente_id: number;
  data?: string;
  status: string;
  total?: number;
}

export interface ItemPedido {
  id?: number;
  pedido_id: number;
  livro_id: number;
  quantidade: number;
  preco_unitario: number;
}

export const PedidoService = {
  async listar(): Promise<Pedido[]> {
    const response = await api.get('/pedidos/');
    return response.data;
  },

  async obter(id: number): Promise<Pedido> {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  async criar(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    const response = await api.post('/pedidos/', pedido);
    return response.data.data;
  },

  async atualizar(id: number, pedido: Partial<Pedido>): Promise<Pedido> {
    const response = await api.put(`/pedidos/${id}`, pedido);
    return response.data.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/pedidos/${id}`);
  },

  async adicionarItem(pedido_id: number, item: Omit<ItemPedido, 'id' | 'pedido_id'>): Promise<ItemPedido> {
    const response = await api.post(`/itens-pedido/`, {
      ...item,
      pedido_id
    });
    return response.data.data;
  },

  async removerItem(item_id: number): Promise<void> {
    await api.delete(`/itens-pedido/${item_id}`);
  },
};

// React Query hooks
export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: () => PedidoService.listar(),
  });
};

export const usePedidosByCliente = (clienteId: number) => {
  return useQuery({
    queryKey: ['pedidos', { clienteId }],
    queryFn: async () => {
      const pedidos = await PedidoService.listar();
      return pedidos.filter(pedido => pedido.cliente_id === clienteId);
    },
    enabled: !!clienteId,
  });
};

export const usePedido = (id: number) => {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => PedidoService.obter(id),
    enabled: !!id,
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (pedido: Omit<Pedido, 'id'>) => PedidoService.criar(pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, pedido }: { id: number; pedido: Partial<Pedido> }) => 
      PedidoService.atualizar(id, pedido),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.id] });
    },
  });
};

export const useDeletePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => PedidoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useAddItemPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ pedidoId, item }: { pedidoId: number; item: Omit<ItemPedido, 'id' | 'pedido_id'> }) => 
      PedidoService.adicionarItem(pedidoId, item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useRemoveItemPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: number) => PedidoService.removerItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};