import { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/NavBar";
import { useClientes } from "../../services/clientes";
import {
  useItensPedido,
  useCreateItemPedido,
  useUpdateItemPedido,
  useDeleteItemPedido,
} from "../../services/itensPedido";
import { useLivros, useUpdateLivro } from "../../services/livros";
import {
  Pedido,
  usePedidos,
  useCreatePedido,
  useUpdatePedido,
  useDeletePedido,
} from "../../services/pedidos";
import { OrdersGlobalStyles } from "./styles";
import { ItemPedido } from "../../services/itensPedido"; // Import ItemPedido type







// Helper function to format date string
const formatarDataString = (date?: Date | string): string => {
  if (!date) return new Date().toISOString().split("T")[0];
  if (typeof date === "string") {
    // Check if it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Try to parse other formats
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }
  } else if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  // Fallback to today if parsing fails
  return new Date().toISOString().split("T")[0];
};

// Helper function to format currency
const formatarMoeda = (valor: number | undefined): string => {
  const numero = Number(valor || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
};

// Helper function to format date for display
const formatarDataExibicao = (dataString?: string) => {
  if (!dataString) return "N/A";
  try {
    // Assuming dataString is YYYY-MM-DD or compatible
    const [year, month, day] = dataString.split("-").map(Number);
    // Use UTC to avoid timezone issues with date-only strings
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
      "pt-BR",
      { timeZone: "UTC" }
    );
  } catch {
    return dataString; // Fallback if parsing fails
  }
};

// Initial state for a new item
const initialItemState: Omit<ItemPedido, "id" | "pedido_id"> & { originalItemId?: number } = {
  livro_id: 0,
  quantidade: 1,
  preco_unitario: 0.0,
};

const Pedidos = () => {
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [novoPedidoData, setNovoPedidoData] = useState<
    Omit<Pedido, "id" | "total">
  >({
    cliente_id: 0,
    data: formatarDataString(),
    status: "Processando",
  });
  const [itensFormulario, setItensFormulario] = useState<
    (Omit<ItemPedido, "id" | "pedido_id"> & { originalItemId?: number })[]
  >([initialItemState]);

  // React Query Hooks
  const {
    data: pedidos = [],
    isLoading: pedidosLoading,
    isError: pedidosError,
    error: pedidosQueryError,
  } = usePedidos();
  const {
    data: livros = [],
    isLoading: livrosLoading,
    isError: livrosError,
    error: livrosQueryError,
  } = useLivros();
  const {
    data: clientes = [],
    isLoading: clientesLoading,
    isError: clientesError,
    error: clientesQueryError,
  } = useClientes();
  const {
    data: todosItensPedido = [],
    isLoading: itensLoading,
    isError: itensError,
    error: itensQueryError,
  } = useItensPedido(); // Fetch all items once

  const createPedidoMutation = useCreatePedido();
  const updatePedidoMutation = useUpdatePedido();
  const deletePedidoMutation = useDeletePedido();
  const createItemPedidoMutation = useCreateItemPedido();
  const updateItemPedidoMutation = useUpdateItemPedido(); // Assuming you have this
  const deleteItemPedidoMutation = useDeleteItemPedido(); // Assuming you have this
  const updateLivroMutation = useUpdateLivro(); // For stock updates

  const [descontoFlamengo, setDescontoFlamengo] = useState(false);
const [descontoOnePiece, setDescontoOnePiece] = useState(false);
const [descontoNascidoEmMari, setDescontoNascidoEmMari] = useState(false);
const [metodoPagamento, setMetodoPagamento] = useState("");// Default to "cartao"

// Função para calcular o desconto
const calcularDesconto = () => {
  let desconto = 0;

  if (descontoFlamengo) desconto += 0.05;  // 5% de desconto se escolher Flamengo
  if (descontoOnePiece) desconto += 0.05;  // 5% de desconto se escolher One Piece
  if (descontoNascidoEmMari) desconto += 0.10;  // 10% de desconto se escolher Nascido em Mari

  return desconto;
};

  // Map items to their orders for easy access
  const itensPorPedido = useMemo(() => {
    const mapa: Record<number, ItemPedido[]> = {};
    todosItensPedido.forEach((item) => {
      if (!mapa[item.pedido_id]) {
        mapa[item.pedido_id] = [];
      }
      mapa[item.pedido_id].push(item);
    });
    return mapa;
  }, [todosItensPedido]);

  // Calculate total for the form
  const totalFormulario = useMemo(() => {
    return itensFormulario.reduce(
      (total, item) =>
        total + (item.preco_unitario || 0) * (item.quantidade || 0),
      0
    );
  }, [itensFormulario]);

  // Effect to populate form when editing
  useEffect(() => {
    if (pedidoEditando && pedidoEditando.id) {
      setNovoPedidoData({
        cliente_id: pedidoEditando.cliente_id,
        data: formatarDataString(pedidoEditando.data),
        status: pedidoEditando.status || "Processando",
      });
      const itemsDoPedido = itensPorPedido[pedidoEditando.id] || [];
      setItensFormulario(
        itemsDoPedido.length > 0
          ? itemsDoPedido.map((item) => ({
              livro_id: item.livro_id,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
              // Keep original item ID if available for update logic
              originalItemId: item.id,
            }))
          : [initialItemState]
      );
      setMostrarFormulario(true);
    } else {
      // Reset form when not editing
      setNovoPedidoData({
        cliente_id: 0,
        data: formatarDataString(),
        status: "Processando",
      });
      setItensFormulario([initialItemState]);
    }
  }, [pedidoEditando, itensPorPedido]);

  const handleAdicionarItem = () => {
    setItensFormulario([...itensFormulario, initialItemState]);
  };

  const handleRemoverItem = (index: number) => {
    if (itensFormulario.length > 1) {
      const novosItens = [...itensFormulario];
      novosItens.splice(index, 1);
      setItensFormulario(novosItens);
    } else {
      setError("Um pedido deve ter pelo menos um item.");
    }
  };

  const handleItemChange = (
    index: number,
    campo: keyof Omit<ItemPedido, "id" | "pedido_id">,
    valor: any
  ) => {
    const novosItens = [...itensFormulario];
    let novoValor = valor;
    const currentItem = novosItens[index];

    if (campo === "quantidade") {
      novoValor = parseInt(valor) || 0;
      const livroSelecionado = livros.find(
        (l) => l.id === currentItem.livro_id
      );
      if (livroSelecionado && novoValor > livroSelecionado.estoque) {
        novoValor = livroSelecionado.estoque;
        setError(
          `A quantidade excede o estoque disponível (${livroSelecionado.estoque}) do livro "${livroSelecionado.titulo}".`
        );
      } else {
        setError(null); // Clear error if quantity is valid
      }
      if (novoValor < 1) novoValor = 1; // Ensure quantity is at least 1
    } else if (campo === "livro_id") {
      novoValor = Number(valor);
      const livroSelecionado = livros.find((l) => l.id === novoValor);
      currentItem.preco_unitario = livroSelecionado?.preco || 0;
      // Reset quantity validation error when book changes
      setError(null);
      // Re-validate quantity for the new book
      if (currentItem.quantidade > (livroSelecionado?.estoque ?? 0)) {
        currentItem.quantidade = livroSelecionado?.estoque ?? 0;
        if (
          currentItem.quantidade < 1 &&
          (livroSelecionado?.estoque ?? 0) > 0
        ) {
          currentItem.quantidade = 1;
        }
        setError(
          `Quantidade ajustada para o estoque disponível (${
            livroSelecionado?.estoque ?? 0
          }) do livro "${livroSelecionado?.titulo}".`
        );
      }
      if (currentItem.quantidade < 1) currentItem.quantidade = 1;
    } else if (campo === "preco_unitario") {
      novoValor = parseFloat(valor) || 0;
    }

    novosItens[index] = { ...currentItem, [campo]: novoValor };
    setItensFormulario(novosItens);
  };

  const handleIniciarEdicao = (pedido: Pedido) => {
    setPedidoEditando(pedido);
    setError(null);
    // Form population is handled by useEffect
  };

  const handleCancelarFormulario = () => {
    setPedidoEditando(null);
    setMostrarFormulario(false);
    setError(null);
    // Form reset is handled by useEffect
  };

  const handleSalvarPedido = async () => {
    setError(null);
    try {
      // Validations
      if (!novoPedidoData.cliente_id) throw new Error("Selecione um cliente");
      if (!novoPedidoData.data) throw new Error("Data do pedido é obrigatória");
      if (
        itensFormulario.some(
          (item) =>
            !item.livro_id || item.quantidade <= 0 || item.preco_unitario < 0
        )
      ) {
        throw new Error(
          "Verifique os itens do pedido (Livro, Quantidade > 0, Preço >= 0)"
        );
      }
      if (itensFormulario.length === 0) {
        throw new Error("O pedido deve conter pelo menos um item.");
      }

      const dadosPedidoParaSalvar = {
        ...novoPedidoData,
        total: totalComDesconto,
      };

      if (pedidoEditando?.id) {
        // --- UPDATE ---
        // 1. Update Order Details (Status, Date, Client, Total)
        await updatePedidoMutation.mutateAsync({
          id: pedidoEditando.id,
          pedido: dadosPedidoParaSalvar,
        });

        // 2. Sync Items (More complex: Add new, Update existing, Delete removed)
        const pedidoId = pedidoEditando.id;
        const itensAtuaisNoBackend = itensPorPedido[pedidoId] || [];
        const itensAtuaisIds = new Set(
          itensAtuaisNoBackend.map((item) => item.id)
        );
        const itensFormularioIds = new Set(
          itensFormulario
            .map((item) => item.originalItemId)
            .filter((id) => id !== undefined)
        );

        // Identify items to delete
        const itensParaDeletar = itensAtuaisNoBackend.filter(
          (item) => item.id !== undefined && !itensFormularioIds.has(item.id)
        );

        // Identify items to update and create
        const itensParaAtualizar: any[] = [];
        const itensParaCriar: any[] = [];

        for (const itemForm of itensFormulario) {
          if (
            itemForm.originalItemId &&
            itensAtuaisIds.has(itemForm.originalItemId)
          ) {
            // Item exists, check if needs update
            const itemBackend = itensAtuaisNoBackend.find(
              (i) => i.id === itemForm.originalItemId
            );
            if (
              itemBackend &&
              (itemBackend.quantidade !== itemForm.quantidade ||
                itemBackend.preco_unitario !== itemForm.preco_unitario ||
                itemBackend.livro_id !== itemForm.livro_id)
            ) {
              itensParaAtualizar.push({
                id: itemForm.originalItemId,
                item: {
                  // Only send changed fields if API supports partial updates
                  livro_id: itemForm.livro_id,
                  quantidade: itemForm.quantidade,
                  preco_unitario: itemForm.preco_unitario,
                  pedido_id: pedidoId, // Include pedido_id if needed by update endpoint
                },
              });
            }
          } else {
            // New item to create
            itensParaCriar.push({
              pedido_id: pedidoId,
              livro_id: itemForm.livro_id,
              quantidade: itemForm.quantidade,
              preco_unitario: itemForm.preco_unitario,
            });
          }
        }

        // Execute mutations
        await Promise.all([
          ...itensParaDeletar.map((item) =>
            deleteItemPedidoMutation.mutateAsync(item.id!)
          ),
          ...itensParaAtualizar.map((payload) =>
            updateItemPedidoMutation.mutateAsync(payload)
          ),
          ...itensParaCriar.map((itemData) =>
            createItemPedidoMutation.mutateAsync(itemData)
          ),
        ]);

        // Note: Stock adjustment logic might be needed here too if items changed significantly
      } else {
        // --- CREATE ---
        // 1. Create Order
        const pedidoCriado = await createPedidoMutation.mutateAsync(
          dadosPedidoParaSalvar
        );

        if (!pedidoCriado || typeof pedidoCriado.id !== "number") {
          throw new Error("Falha ao obter ID do pedido criado.");
        }
        const pedidoId = pedidoCriado.id;

        // 2. Create Items and Update Stock
        await Promise.all(
          itensFormulario.map(async (item) => {
            // Create item
            await createItemPedidoMutation.mutateAsync({
              pedido_id: pedidoId,
              livro_id: item.livro_id,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
            });

            // Update stock
            const livro = livros.find((l) => l.id === item.livro_id);
            if (livro) {
              const novoEstoque = Math.max(0, livro.estoque - item.quantidade); // Prevent negative stock
              // Use updateLivroMutation - ensure it handles partial updates or send full object
              await updateLivroMutation.mutateAsync({
                id: livro.id!,
                livro: { estoque: novoEstoque }, // Send only stock if API supports partial update
                // Or: livro: { ...livro, estoque: novoEstoque } if full object needed
              });
            }
          })
        );
      }

      handleCancelarFormulario(); // Close form on success
    } catch (err: any) {
      setError(`Erro ao salvar pedido: ${err.message || "Erro desconhecido"}`);
      console.error("Erro ao salvar pedido:", err);
    }
  };

  const handleExcluirPedido = async (id: number) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o pedido #${id}? Esta ação não pode ser desfeita.`
      )
    ) {
      setError(null);
      try {
        // Optional: Add logic here to revert stock if needed, though complex.
        // Usually, orders aren't fully deleted, but cancelled.
        // If deleting, associated items might need deletion first depending on DB constraints.
        // Assuming cascade delete or manual item deletion is handled by backend or separate logic.
        await deletePedidoMutation.mutateAsync(id);
      } catch (err: any) {
        setError(
          `Erro ao excluir pedido: ${err.message || "Verifique dependências."}`
        );
        console.error("Erro ao excluir pedido:", err);
      }
    }
  };

  // Função para calcular o total com desconto
const totalComDesconto = useMemo(() => {
  const desconto = calcularDesconto();
  const total = itensFormulario.reduce(
    (total, item) =>
      total + (item.preco_unitario || 0) * (item.quantidade || 0),
    0
  );
  return total * (1 - desconto);  // Aplica o desconto no total
}, [itensFormulario, descontoFlamengo, descontoOnePiece, descontoNascidoEmMari]);
  

  // Combined loading state
  const isLoading =
    pedidosLoading || livrosLoading || clientesLoading || itensLoading;
  // Combined error state
  const queryError = pedidosError || livrosError || clientesError || itensError;
  const queryErrorMessage =
    (pedidosQueryError as Error)?.message ||
    (livrosQueryError as Error)?.message ||
    (clientesQueryError as Error)?.message ||
    (itensQueryError as Error)?.message ||
    "Erro ao carregar dados.";

  const displayError = error || (queryError ? queryErrorMessage : null);
  const isMutating =
    createPedidoMutation.isPending ||
    updatePedidoMutation.isPending ||
    deletePedidoMutation.isPending ||
    createItemPedidoMutation.isPending ||
    updateItemPedidoMutation.isPending ||
    deleteItemPedidoMutation.isPending ||
    updateLivroMutation.isPending;

  return (
    <>
      <Navbar />
      <OrdersGlobalStyles />
      <div className="container-gestao">
        <h1 className="titulo-pagina">Gestão de Pedidos</h1>

        {displayError && (
          <div
            className="error-message general-error"
            style={{
              marginBottom: "1rem",
              background: "#fee2e2",
              color: "#991b1b",
              padding: "0.75rem",
              borderRadius: "0.5rem",
            }}
          >
            {displayError}
          </div>
        )}

        <div className="acoes-gestao">
          <button
            className="botao botao-primario"
            onClick={() => {
              if (mostrarFormulario) {
                handleCancelarFormulario();
              } else {
                setPedidoEditando(null); // Ensure we are in create mode
                setMostrarFormulario(true);
                setError(null);
              }
            }}
            disabled={isMutating}
          >
            {mostrarFormulario ? "Fechar Formulário" : "Novo Pedido"}
          </button>
        </div>

        {mostrarFormulario && (
  <div className="formulario-gestao">
    <h2 className="titulo-formulario">
      {pedidoEditando
        ? `Editando Pedido #${pedidoEditando.id}`
        : "Criar Novo Pedido"}
    </h2>

    {/* --- Form Fields --- */}
    <div className="grid-formulario">
      {/* Client Selection (Only for Create) */}
      {!pedidoEditando && (
        <div className="grupo-formulario">
          <label htmlFor="cliente_id">Cliente</label>
          <select
            id="cliente_id"
            className="controle-formulario"
            value={novoPedidoData.cliente_id}
            onChange={(e) =>
              setNovoPedidoData({
                ...novoPedidoData,
                cliente_id: parseInt(e.target.value) || 0,
              })
            }
            disabled={isMutating || !!pedidoEditando} // Disable when editing
          >
            <option value={0}>Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} ({cliente.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display Client Name (Only for Edit) */}
      {pedidoEditando && (
        <div className="grupo-formulario">
          <label>Cliente</label>
          <input
            type="text"
            className="controle-formulario"
            value={
              clientes.find((c) => c.id === pedidoEditando.cliente_id)
                ?.nome || "Cliente não encontrado"
            }
            readOnly
            disabled
          />
        </div>
      )}

      <div className="grupo-formulario">
        <label htmlFor="data">Data</label>
        <input
          id="data"
          type="date"
          className="controle-formulario"
          value={novoPedidoData.data}
          onChange={(e) =>
            setNovoPedidoData({
              ...novoPedidoData,
              data: e.target.value,
            })
          }
          disabled={isMutating}
        />
      </div>

      <div className="grupo-formulario">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          className="controle-formulario"
          value={novoPedidoData.status}
          onChange={(e) =>
            setNovoPedidoData({
              ...novoPedidoData,
              status: e.target.value,
            })
          }
          disabled={isMutating}
        >
          <option value="Processando">Processando</option>
          <option value="Enviado">Enviado</option>
          <option value="Concluído">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="grupo-formulario">
        <label htmlFor="pagamento">Método de Pagamento</label>
        <select
          id="pagamento"
          className="controle-formulario"
          value={metodoPagamento}
          onChange={(e) => setMetodoPagamento(e.target.value)}
          disabled={isMutating}
        >
          <option value="">Selecione um método</option>
          <option value="pix">PIX</option>
          <option value="boleto">Boleto Bancário</option>
          <option value="cartao_credito">Cartão de Crédito</option>
          <option value="cartao_debito">Cartão de Débito</option>
          <option value="dinheiro">Dinheiro</option>
        </select>
      </div>
      {/* --- Discount Checkboxes --- */}
      <h2>Descontos</h2>
      <label>
        <input
          type="checkbox"
          checked={descontoFlamengo}
          onChange={() => setDescontoFlamengo(!descontoFlamengo)}
        />
        Desconto Flamengo (5%)
      </label>
      <label>
        <input
          type="checkbox"
          checked={descontoOnePiece}
          onChange={() => setDescontoOnePiece(!descontoOnePiece)}
        />
        Desconto One Piece (5%)
      </label>
      <label>
        <input
          type="checkbox"
          checked={descontoNascidoEmMari}
          onChange={() => setDescontoNascidoEmMari(!descontoNascidoEmMari)}
        />
        Desconto Nascido em Mari (10%)
      </label>

      <h3>Total com Desconto: {formatarMoeda(totalComDesconto)}</h3>

      <div className="grupo-formulario">
        <label>Total Calculado</label>
        <input
          type="text"
          className="controle-formulario"
          value={formatarMoeda(totalFormulario)}
          readOnly
          disabled
        />
      </div>
    </div>

    {/* --- Items Section --- */}
    <h3 className="subtitulo-formulario">Itens do Pedido</h3>
    {itensFormulario.map((item, index) => (
      <div key={index} className="item-pedido-form">
        <div
          className="grid-formulario"
          style={{ alignItems: "flex-end", gap: "1rem" }}
        >
          {" "}
          {/* Align items for button */}
          <div className="grupo-formulario" style={{ marginBottom: 0 }}>
            <label htmlFor={`livro-${index}`}>Livro</label>
            <select
              id={`livro-${index}`}
              className="controle-formulario"
              value={item.livro_id}
              onChange={(e) =>
                handleItemChange(index, "livro_id", e.target.value)
              }
              disabled={isMutating}
            >
              <option value={0}>Selecione um livro</option>
              {livros
                // Show all books, validation happens on quantity change
                .map((livro) => (
                  <option key={livro.id} value={livro.id}>
                    {livro.titulo} (Estoque: {livro.estoque}) -{" "}
                    {formatarMoeda(livro.preco)}
                  </option>
                ))}
            </select>
          </div>
          <div className="grupo-formulario" style={{ marginBottom: 0 }}>
            <label htmlFor={`quantidade-${index}`}>Quantidade</label>
            <input
              id={`quantidade-${index}`}
              type="number"
              min="1"
              className="controle-formulario"
              value={item.quantidade}
              onChange={(e) =>
                handleItemChange(index, "quantidade", e.target.value)
              }
              disabled={isMutating || !item.livro_id} // Disable if no book selected
            />
          </div>
          <div className="grupo-formulario" style={{ marginBottom: 0 }}>
            <label htmlFor={`preco-${index}`}>Preço Unitário</label>
            <input
              id={`preco-${index}`}
              type="text" // Display formatted currency
              className="controle-formulario"
              value={formatarMoeda(item.preco_unitario)}
              readOnly
              disabled
            />
          </div>
          <div className="grupo-formulario" style={{ marginBottom: 0 }}>
            {/* <label>&nbsp;</label> Keep label for alignment or remove */}
            <button
              type="button"
              className="botao botao-perigo"
              onClick={() => handleRemoverItem(index)}
              disabled={isMutating || itensFormulario.length <= 1}
              style={{ width: "100%" }} // Make button full width in its grid cell
            >
              Remover Item
            </button>
          </div>
        </div>
      </div>
    ))}

    <button
      type="button"
      className="botao botao-secundario" // Use a different style for add item
      onClick={handleAdicionarItem}
      disabled={isMutating}
      style={{
        marginTop: "1rem",
        background: "#6c757d",
        color: "white",
      }}
    >
      Adicionar Item
    </button>

    {/* --- Form Actions --- */}
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        gap: "1rem",
        borderTop: "1px solid var(--border)",
        paddingTop: "1.5rem",
      }}
    >
      <button
        className="botao botao-primario"
        onClick={handleSalvarPedido}
        disabled={isMutating}
      >
        {isMutating ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Salvando...
          </>
        ) : pedidoEditando ? (
          "Salvar Alterações"
        ) : (
          "Criar Pedido"
        )}
      </button>
      <button
        type="button"
        className="botao botao-secundario"
        onClick={handleCancelarFormulario}
        disabled={isMutating}
        style={{ background: "#6c757d", color: "white" }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}


        {/* --- Orders Table --- */}
        {isLoading ? (
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
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length > 0 ? (
                  pedidos.map((pedido) => {
                    const cliente = clientes.find(
                      (c) => c.id === pedido.cliente_id
                    );
                    const itensDoPedido = itensPorPedido[pedido.id!] || [];
                    const totalPedidoCalculado = itensDoPedido.reduce(
                      (sum, item) =>
                        sum + item.quantidade * item.preco_unitario,
                      0
                    );

                    return (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>
                          {cliente
                            ? `${cliente.nome}`
                            : "Cliente não encontrado"}
                        </td>
                        <td>{formatarDataExibicao(pedido.data)}</td>
                        <td>
                          <span
                            className={`status-badge status-${(
                              pedido.status || "processando"
                            )
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {pedido.status || "Processando"}
                          </span>
                        </td>
                        <td>
                          {itensDoPedido.length > 0 ? (
                            <ul className="lista-itens">
                              {itensDoPedido.map((item) => {
                                const livro = livros.find(
                                  (l) => l.id === item.livro_id
                                );
                                return (
                                  <li key={item.id}>
                                    {item.quantidade}x{" "}
                                    {livro?.titulo || "Livro desconhecido"} (
                                    {formatarMoeda(item.preco_unitario)})
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {formatarMoeda(pedido.total ?? totalPedidoCalculado)}
                        </td>
                        <td className="celula-acoes">
                          <button
                            className="botao botao-aviso" // Edit button style
                            onClick={() => handleIniciarEdicao(pedido)}
                            disabled={isMutating}
                          >
                            Editar
                          </button>
                          <button
                            className="botao botao-perigo" // Delete button style
                            onClick={() =>
                              pedido.id && handleExcluirPedido(pedido.id)
                            }
                            disabled={
                              (deletePedidoMutation.isPending &&
                                deletePedidoMutation.variables === pedido.id) ||
                              isMutating
                            }
                          >
                            {deletePedidoMutation.isPending &&
                            deletePedidoMutation.variables === pedido.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              "Excluir"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Pedidos;
