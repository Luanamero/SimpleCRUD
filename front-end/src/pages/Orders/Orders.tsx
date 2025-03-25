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
  
  // Form states
  const [novoPedido, setNovoPedido] = useState<Omit<Pedido, 'id'>>({
    cliente_id: 0,
    status: 'Processando'
  });
  const [itensNovoPedido, setItensNovoPedido] = useState<ItemPedido[]>([
    {
      livro_id: 0, quantidade: 1, preco_unitario: 0,
      pedido_id: 0
    }
  ]);
  
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [dadosPedidos, dadosLivros, dadosClientes] = await Promise.all([
          PedidoService.listar(),
          LivroService.listar(),
          ClienteService.listar()
        ]);

        setPedidos(dadosPedidos);
        setLivros(dadosLivros);
        setClientes(dadosClientes);

        // Carregar itens para cada pedido
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
    
    carregarDados();
  }, []);

  const handleCriarPedido = async () => {
    try {
      // Primeiro cria o pedido
      const pedidoCriado = await PedidoService.criar(novoPedido);
      
      // Depois cria os itens do pedido
      if (pedidoCriado.id) {
        const itensCriados = await Promise.all(
          itensNovoPedido.map(item => 
            ItemPedidoService.criar({
              ...item,
              pedido_id: pedidoCriado.id as number
            })
          )
        );
        
        // Atualiza o estado
        setPedidos([...pedidos, pedidoCriado]);
        setItensPedido({
          ...itensPedido,
          [pedidoCriado.id]: itensCriados
        });
        
        // Reseta o formulário
        setNovoPedido({ cliente_id: 0, status: 'Processando' });
        setItensNovoPedido([{
          livro_id: 0, quantidade: 1, preco_unitario: 0,
          pedido_id: 0
        }]);
        setMostrarFormulario(false);
      }
    } catch (erro) {
      console.error('Erro ao criar pedido:', erro);
    }
  };

  const handleAdicionarItem = () => {
    setItensNovoPedido([
      ...itensNovoPedido,
      {
        livro_id: 0, quantidade: 1, preco_unitario: 0,
        pedido_id: 0
      }
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
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    
    // Atualiza o preço unitário se o livro foi alterado
    if (campo === 'livro_id') {
      const livroSelecionado = livros.find(l => l.id === Number(valor));
      if (livroSelecionado) {
        novosItens[index].preco_unitario = livroSelecionado.preco;
      }
    }
    
    setItensNovoPedido(novosItens);
  };

  const calcularTotalPedido = (pedidoId: number) => {
    if (!pedidoId || !itensPedido[pedidoId]) return 0;
    
    return itensPedido[pedidoId].reduce(
      (total, item) => total + (item.preco_unitario * item.quantidade),
      0
    );
  };

  const handleAtualizarStatus = async (id: number, status: string) => {
    try {
      await PedidoService.atualizar(id, { status });
      setPedidos(pedidos.map(pedido => 
        pedido.id === id ? { ...pedido, status } : pedido
      ));
    } catch (erro) {
      console.error('Erro ao atualizar pedido:', erro);
    }
  };

  const handleExcluirPedido = async (id: number) => {
    try {
      await PedidoService.excluir(id);
      setPedidos(pedidos.filter(pedido => pedido.id !== id));
      
      // Remove os itens do estado também
      const novosItens = { ...itensPedido };
      delete novosItens[id];
      setItensPedido(novosItens);
    } catch (erro) {
      console.error('Erro ao excluir pedido:', erro);
    }
  };

  return (
    <><Navbar /><div className="container-gestao">
      <h1 className="titulo-pagina">Gestão de Pedidos</h1>

      <div className="acoes-gestao">
        <button
          className="botao botao-primario"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? 'Cancelar' : 'Novo Pedido'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-gestao">
          <h2 className="titulo-formulario">Criar Novo Pedido</h2>

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
                        {livro.titulo} - {livro.autor_id} (R$ {livro.preco})
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
                    onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))} />
                </div>

                <div className="grupo-formulario">
                  <label>Preço Unitário</label>
                  <input
                    type="number"
                    step="0.01"
                    className="controle-formulario"
                    value={item.preco_unitario}
                    readOnly />
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

          <div style={{ marginTop: '1rem' }}>
            <button
              className="botao botao-primario"
              onClick={handleCriarPedido}
            >
              Criar Pedido
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
                <th>Itens</th>
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
                    <td>{pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <select
                        value={pedido.status}
                        onChange={(e) => pedido.id && handleAtualizarStatus(pedido.id, e.target.value)}
                        className="seletor-status"
                      >
                        <option value="Processando">Processando</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td>R$ {pedido.id ? calcularTotalPedido(pedido.id).toFixed(2) : '0,00'}</td>
                    <td>
                      {pedido.id && itensPedido[pedido.id]?.length || 0} itens
                      {pedido.id && itensPedido[pedido.id] && (
                        <ul className="lista-itens">
                          {itensPedido[pedido.id].map((item, idx) => {
                            const livro = livros.find(l => l.id === item.livro_id);
                            return (
                              <li key={idx}>
                                {livro ? livro.titulo : 'Livro não encontrado'}
                                (x{item.quantidade}) - R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                    <td className="celula-acoes">
                      <button
                        className="botao botao-perigo"
                        onClick={() => pedido.id && handleExcluirPedido(pedido.id)}
                      >
                        Excluir
                      </button>
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