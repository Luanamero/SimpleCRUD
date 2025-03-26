import React, { useState, useEffect } from 'react';
import { PedidoService, Pedido } from '../../services/pedidos';
import { ItemPedidoService, ItemPedido } from '../../services/itensPedido';
import { LivroService, Livro } from '../../services/livros';
import { ClienteService, Cliente } from '../../services/clientes';
import './Orders.css';
import Navbar from '../../components/NavBar';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [itensPedido, setItensPedido] = useState<Record<number, ItemPedido[]>>({});
  const [livros, setLivros] = useState<Livro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  
  // Form states
  const [novoPedido, setNovoPedido] = useState<Omit<Pedido, 'id'>>({
    cliente_id: 0,
    data: new Date().toISOString().split('T')[0],
    total: 0,
    status: "Processando"
  });

  const [itensNovoPedido, setItensNovoPedido] = useState<Omit<ItemPedido, 'id'>[]>([
    { livro_id: 0, quantidade: 1, preco_unitario: 0.0, pedido_id: 0 }
  ]);
  
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [dadosPedidos, dadosLivros, dadosClientes] = await Promise.all([
        PedidoService.listar(),
        LivroService.listar(),
        ClienteService.listar()
      ]);

      setPedidos(dadosPedidos);
      setLivros(dadosLivros);
      setClientes(dadosClientes);

      const mapaItens: Record<number, ItemPedido[]> = {};
      const todosItens = await ItemPedidoService.listar();
      
      dadosPedidos.forEach(pedido => {
        if (pedido.id) {
          mapaItens[pedido.id] = todosItens.filter(item => item.pedido_id === pedido.id);
        }
      });
      
      setItensPedido(mapaItens);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const resetarFormulario = () => {
    setNovoPedido({ 
      cliente_id: 0, 
      data: new Date().toISOString().split('T')[0],
      total: 0,
      status: "Processando"
    });
    setItensNovoPedido([{
      livro_id: 0, quantidade: 1, preco_unitario: 0.0,
      pedido_id: 0
    }]);
    setPedidoEditando(null);
  };

  const calcularTotalPedido = (itens: ItemPedido[]) => {
    return itens.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0);
  };

  useEffect(() => {
    const novoTotal = calcularTotalPedido(itensNovoPedido);
    setNovoPedido(prev => ({ ...prev, total: novoTotal }));
  }, [itensNovoPedido]);

  const handleAdicionarItem = () => {
    setItensNovoPedido([
      ...itensNovoPedido,
      { livro_id: 0, quantidade: 1, preco_unitario: 0.0, pedido_id: 0 }
    ]);
  };

  const handleRemoverItem = (index: number) => {
    if (itensNovoPedido.length > 1) {
      const novosItens = [...itensNovoPedido];
      novosItens.splice(index, 1);
      setItensNovoPedido(novosItens);
    }
  };

  const handleItemChange = (index: number, campo: keyof ItemPedido, valor: any) => {
    const novosItens = [...itensNovoPedido];
    novosItens[index] = { 
      ...novosItens[index], 
      [campo]: campo === 'quantidade' ? parseInt(valor) || 0 : valor 
    };

    if (campo === 'livro_id') {
      const livroSelecionado = livros.find(l => l.id === Number(valor));
      novosItens[index].preco_unitario = livroSelecionado?.preco || 0;
    }
  
    setItensNovoPedido(novosItens);
  };

  // Função segura para formatar valores monetários
const formatarMoeda = (valor: number | undefined): string => {
  // Converte para número (caso seja string)
  const numero = Number(valor || 0);
  
  // Formata com 2 casas decimais usando Intl.NumberFormat
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
};

  const handleIniciarEdicao = (pedido: Pedido) => {
    setPedidoEditando(pedido);
    setNovoPedido({
      cliente_id: pedido.cliente_id,
      data: pedido.data,
      total: pedido.total,
      status: pedido.status
    });
    
    if (pedido.id && itensPedido[pedido.id]) {
      setItensNovoPedido(itensPedido[pedido.id].map(item => ({
        livro_id: item.livro_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        pedido_id: item.pedido_id
      })));
    }
    
    setMostrarFormulario(true);
  };

  const handleCancelarEdicao = () => {
    resetarFormulario();
    setMostrarFormulario(false);
  };

  const handleSalvarPedido = async () => {
    try {
      if (pedidoEditando?.id) {
        await PedidoService.atualizar(pedidoEditando.id, {
          status: novoPedido.status,
          data: novoPedido.data,
          total: novoPedido.total,
          cliente_id: novoPedido.cliente_id
        });
      } else {
        const total = calcularTotalPedido(itensNovoPedido);
        const pedidoCriado = await PedidoService.criar({
          cliente_id: novoPedido.cliente_id,
          data: novoPedido.data,
          total,
          status: novoPedido.status
        });
  
        // Verificação segura + criação de itens
        if (pedidoCriado.id) {
          const itensParaCriar = itensNovoPedido.map(item => ({
            livro_id: item.livro_id,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
            pedido_id: pedidoCriado.id // TypeScript sabe que é number aqui
          }));
  
          await Promise.all(
            itensParaCriar.map(item => ItemPedidoService.criar(item))
          );
        }
      }
  
      await carregarDados();
      handleCancelarEdicao();
    } catch (erro) {
      console.error('Erro ao salvar pedido:', erro);
    }
  };

  const handleExcluirPedido = async (id: number) => {
    try {
      await PedidoService.excluir(id);
      // Recarrega os dados após exclusão
      await carregarDados();
    } catch (erro) {
      console.error('Erro ao excluir pedido:', erro);
    }
  };

  const handleAtualizarStatus = async (id: number, status: string) => {
    try {
      // 1. Primeiro busca o pedido atual para obter os valores existentes
      const pedidoAtual = await PedidoService.obter(id);
      console.log("pedido atual:",pedidoAtual)
      
      // 2. Atualiza enviando todos os campos obrigatórios
      await PedidoService.atualizar(id, {
        cliente_id: pedidoAtual.cliente_id, // Mantém o valor existente
        data: pedidoAtual.data,             // Mantém o valor existente
        total: pedidoAtual.total,           // Mantém o valor existente
        status: status                      // Apenas o status é alterado
      });
      
      // 3. Recarrega os dados após atualização
      await carregarDados();
    } catch (erro) {
      console.error('Erro ao atualizar status:', erro);
      
      // Opcional: Mostrar feedback para o usuário
      // alert('Não foi possível atualizar o status');
    }
  };

  return (
    <><Navbar /><div className="container-gestao">
      <h1 className="titulo-pagina">Gestão de Pedidos</h1>
  
      <div className="acoes-gestao">
        <button
          className="botao botao-primario"
          onClick={() => {
            resetarFormulario();
            setMostrarFormulario(!mostrarFormulario);
          }}
        >
          {mostrarFormulario ? 'Cancelar' : 'Novo Pedido'}
        </button>
      </div>
  
      {mostrarFormulario && (
        <div className="formulario-gestao">
          <h2 className="titulo-formulario">
            {pedidoEditando ? `Editando Status do Pedido #${pedidoEditando.id}` : 'Criar Novo Pedido'}
          </h2>
  
          {pedidoEditando ? (
            // Formulário de edição (apenas status)
            <div className="grid-formulario">
              <div className="grupo-formulario">
                <label>Status</label>
                <select
                  className="controle-formulario"
                  value={novoPedido.status}
                  onChange={(e) => setNovoPedido({
                    ...novoPedido,
                    status: e.target.value
                  })}
                >
                  <option value="Processando">Processando</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          ) : (
            // Formulário de criação (completo)
            <>
              <div className="grid-formulario">
                <div className="grupo-formulario">
                  <label>Cliente</label>
                  <select
                    className="controle-formulario"
                    value={novoPedido.cliente_id}
                    onChange={(e) => setNovoPedido({
                      ...novoPedido,
                      cliente_id: parseInt(e.target.value)
                    })}
                  >
                    <option value="0">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} ({cliente.email})
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="grupo-formulario">
                  <label>Data</label>
                  <input
                    type="date"
                    className="controle-formulario"
                    value={novoPedido.data}
                    onChange={(e) => setNovoPedido({
                      ...novoPedido,
                      data: e.target.value
                    })}
                  />
                </div>
  
                <div className="grupo-formulario">
                  <label>Total</label>
                  <input
                    type="text"
                    className="controle-formulario"
                    value={formatarMoeda(novoPedido.total)}
                    readOnly
                  />
                </div>
              </div>
  
              <h3 className="subtitulo-formulario">Itens do Pedido</h3>
  
              {itensNovoPedido.map((item, index) => (
                <div key={index} className="item-pedido-form">
                  <div className="grid-formulario">
                    <div className="grupo-formulario">
                      <label>Livro</label>
                      <select
                        className="controle-formulario"
                        value={item.livro_id}
                        onChange={(e) => handleItemChange(index, 'livro_id', parseInt(e.target.value))}
                      >
                        <option value="0">Selecione um livro</option>
                        {livros.map(livro => (
                          <option key={livro.id} value={livro.id}>
                            {livro.titulo} ({formatarMoeda(livro.preco)})
                          </option>
                        ))}
                      </select>
                    </div>
  
                    <div className="grupo-formulario">
                      <label>Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        className="controle-formulario"
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))}
                      />
                    </div>
  
                    <div className="grupo-formulario">
                      <label>Preço Unitário</label>
                      <input
                        type="number"
                        step="0.01"
                        className="controle-formulario"
                        value={item.preco_unitario}
                        readOnly
                      />
                    </div>
  
                    <div className="grupo-formulario">
                      <label>Ações</label>
                      <button
                        type="button"
                        className="botao botao-perigo"
                        onClick={() => handleRemoverItem(index)}
                        disabled={itensNovoPedido.length <= 1}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
  
              <button
                type="button"
                className="botao botao-primario"
                onClick={handleAdicionarItem}
                style={{ marginBottom: '1rem' }}
              >
                Adicionar Item
              </button>
            </>
          )}
  
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              className="botao botao-primario"
              onClick={handleSalvarPedido}
            >
              {pedidoEditando ? 'Salvar Status' : 'Criar Pedido'}
            </button>
            
            <button
              className="botao botao-secundario"
              onClick={handleCancelarEdicao}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
  
      {carregando ? (
        <div className="mensagem-carregando">Carregando pedidos...</div>
      ) : (
        <div className="tabela-responsiva">
          <table className="tabela-estilizada">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => {
                const cliente = clientes.find(c => c.id === pedido.cliente_id);
                return (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{cliente ? `${cliente.nome}` : 'Cliente não encontrado'}</td>
                    <td>{pedido.data ? new Date(pedido.data).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {pedido.status}
                    </td>
                    <td>{formatarMoeda(pedido.total)}</td>
                    <td className="celula-acoes">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="botao botao-aviso"
                          onClick={() => handleIniciarEdicao(pedido)}
                        >
                          Editar Status
                        </button>
                        <button
                          className="botao botao-perigo"
                          onClick={() => pedido.id && handleExcluirPedido(pedido.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div></>
  );
};

export default Pedidos;