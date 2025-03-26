import { api } from './api';
import { Autor } from './autores';
import { Cliente } from './clientes';
import { Editora } from './editoras';
import { Livro } from './livros';
import { ItemPedido, Pedido } from './pedidos';

export interface Relatorio {
  livros: Livro[];
  editoras: Editora[];
  autores: Autor[];
  clientes: Cliente[];
  pedidos: Pedido[];
  itens_pedido: ItemPedido[]
}

export const RelatorioService = {
  async obter(): Promise<Relatorio> {
    const response = await api.get(`/relatorio`);
    return response.data.data;
  },
};