import { api } from './api';
import { Autor } from './autores';
import { Cliente } from './clientes';
import { Editora } from './editoras';
import { Livro } from './livros';
import { ItemPedido, Pedido } from './pedidos';

// Interface para a VIEW de clientes/pedidos
export interface ClientePedidoView {
  cliente_id: number;
  cliente_nome: string;
  cliente_email: string;
  total_pedidos: number;
  valor_total_gasto: number;
  ultima_compra: string;
  status_ultimo_pedido: string;
}

export interface Relatorio {
  livros: Livro[];
  editoras: Editora[];
  autores: Autor[];
  clientes: Cliente[];
  pedidos: Pedido[];
  itens_pedido: ItemPedido[];
  clientes_pedidos?: ClientePedidoView[]; // Adicionando a VIEW como opcional
}

export const RelatorioService = {
  // Relatório básico existente
  async obter(): Promise<Relatorio> {
    const response = await api.get(`/relatorio`);
    return response.data.data;
  },

  // Nova função para a VIEW específica
  async obterClientesPedidos(): Promise<ClientePedidoView[]> {
    const response = await api.get('/relatorio/clientes-pedidos');
    return response.data.data;
  },

  // Relatório completo incluindo a VIEW
  async obterCompleto(): Promise<Relatorio> {
    const [relatorioBasico, viewClientes] = await Promise.all([
      this.obter(),
      this.obterClientesPedidos()
    ]);
    
    return {
      ...relatorioBasico,
      clientes_pedidos: viewClientes
    };
  }
};