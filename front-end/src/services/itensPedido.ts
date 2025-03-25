import { api } from './api';

export interface ItemPedido {
  id?: number;
  pedido_id: number;
  livro_id: number;
  quantidade: number;
  preco_unitario: number;
}

export const ItemPedidoService = {
  async listar(): Promise<ItemPedido[]> {
    const response = await api.get('/itens_pedido/');
    return response.data;
  },

  async obter(id: number): Promise<ItemPedido> {
    const response = await api.get(`/itens_pedido/${id}`);
    return response.data;
  },

  async criar(item: Omit<ItemPedido, 'id'>): Promise<ItemPedido> {
    const response = await api.post('/itens_pedido/', item);
    return response.data;
  },

  async atualizar(id: number, item: Partial<ItemPedido>): Promise<ItemPedido> {
    const response = await api.put(`/itens_pedido/${id}`, item);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/itens_pedido/${id}`);
  },
};