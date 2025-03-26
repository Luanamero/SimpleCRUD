import { api } from './api';

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
    console.log(response.data)
    return response.data;
  },

  async obter(id: number): Promise<Pedido> {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  async criar(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    const response = await api.post('/pedidos/', pedido);
    return response.data;
  },

  async atualizar(id: number, pedido: Partial<Pedido>): Promise<Pedido> {
    const response = await api.put(`/pedidos/${id}`, pedido);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/pedidos/${id}`);
  },

  async adicionarItem(pedido_id: number, item: Omit<ItemPedido, 'id' | 'pedido_id'>): Promise<ItemPedido> {
    const response = await api.post(`/pedidos/${pedido_id}/itens`, {
      ...item,
      pedido_id
    });
    return response.data;
  },

  async removerItem(item_id: number): Promise<void> {
    await api.delete(`/pedidos/itens/${item_id}`);
  },
};