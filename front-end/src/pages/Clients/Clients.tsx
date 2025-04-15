import React, { useState, useEffect } from "react";
import {
  Cliente,
  useClientes,
  useCreateCliente,
  useUpdateCliente,
  useDeleteCliente,
} from "../../services/clientes";
import Navbar from "../../components/NavBar";
import { ClientsGlobalStyles } from "./styles";
import { RelatorioService } from "../../services/relatorio";

const Clients = () => {
  const [error, setError] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [newClientData, setNewClientData] = useState<Omit<Cliente, "id">>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Use React Query hooks
  const {
    data: clients = [],
    isLoading,
    isError,
    error: queryError,
  } = useClientes();
  const createClientMutation = useCreateCliente();
  const updateClientMutation = useUpdateCliente();
  const deleteClientMutation = useDeleteCliente();

  // Estado para armazenar os dados do relatório
  const [relatorio, setRelatorio] = useState<any>(null);
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
  const [erroRelatorio, setErroRelatorio] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("clientes");
  
  // Função para carregar o relatório
  const carregarRelatorio = async () => {
    setCarregandoRelatorio(true);
    setErroRelatorio(null);
    try {
      const resultado = await RelatorioService.obterCompleto();
      setRelatorio(resultado);
    } catch (err: any) {
      console.error(err);
      setErroRelatorio('Erro ao carregar relatório.');
    } finally {
      setCarregandoRelatorio(false);
    }
  };

  // Função para formatar data
  const formatarDataExibicao = (dataString?: string) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Mudança de tab (clientes, relatório)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Effect to update form when editingClient changes
  useEffect(() => {
    if (editingClient) {
      setNewClientData({
        nome: editingClient.nome,
        email: editingClient.email,
        telefone: editingClient.telefone,
        endereco: editingClient.endereco || "",
      });
    } else {
      // Reset form when not editing
      setNewClientData({ nome: "", email: "", telefone: "", endereco: "" });
    }
  }, [editingClient]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setError(null);
      try {
        await deleteClientMutation.mutateAsync(id);
      } catch (err) {
        setError("Erro ao excluir o cliente.");
        console.error("Erro ao excluir o cliente:", err);
      }
    }
  };

  const handleEdit = (client: Cliente) => {
    setEditingClient(client);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    // Basic Validation
    if (
      !newClientData.nome ||
      !newClientData.email ||
      !newClientData.telefone
    ) {
      setError("Nome, Email e Telefone são obrigatórios.");
      return;
    }

    try {
      if (editingClient && editingClient.id) {
        await updateClientMutation.mutateAsync({
          id: editingClient.id,
          cliente: newClientData,
        });
      } else {
        await createClientMutation.mutateAsync(newClientData);
      }
      handleCancelEdit(); // Reset form and editing state on success
    } catch (error) {
      setError("Erro ao salvar o cliente.");
      console.error("Erro ao salvar o cliente:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientData((prev) => ({ ...prev, [name]: value }));
  };

  const isMutating =
    createClientMutation.isPending || updateClientMutation.isPending;
  const displayError =
    error ||
    (isError
      ? (queryError as Error)?.message || "Falha ao carregar clientes"
      : null);

  return (
    <>
      <ClientsGlobalStyles />
      <Navbar />

      <div className="profile-tabs">
        <button className={activeTab === "clientes" ? "active" : ""} onClick={() => setActiveTab("clientes")}>
          Visão Geral
        </button>
        <button className={activeTab === "teste" ? "active" : ""} onClick={() => setActiveTab("teste")}>
        Relatórios Clientes
        </button>
      </div>

      <div className="clients-container">
        <h1 className="page-title">Gerenciamento de Clientes</h1>

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

        {activeTab === "clientes" && (
          <>
            <div className="client-form">
              <h2 className="form-title">
                {editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}
              </h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    type="text"
                    name="nome"
                    className="form-control"
                    value={newClientData.nome}
                    onChange={handleChange}
                    disabled={isMutating}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    value={newClientData.email}
                    onChange={handleChange}
                    disabled={isMutating}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    type="text"
                    name="telefone"
                    className="form-control"
                    value={newClientData.telefone}
                    onChange={handleChange}
                    disabled={isMutating}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    type="text"
                    name="endereco"
                    className="form-control"
                    value={newClientData.endereco}
                    onChange={handleChange}
                    disabled={isMutating}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Salvando...
                    </>
                  ) : editingClient ? (
                    "Atualizar"
                  ) : (
                    "Salvar"
                  )}
                </button>

                {editingClient && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={isMutating}
                    style={{ background: "#6c757d", color: "white" }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="loading-message">Carregando clientes...</div>
            ) : (
              <div className="table-responsive">
                <table className="client-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Endereço</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <tr key={client.id}>
                          <td>{client.nome}</td>
                          <td>{client.email}</td>
                          <td>{client.telefone}</td>
                          <td>{client.endereco || "-"}</td>
                          <td className="actions-cell">
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEdit(client)}
                              disabled={
                                isMutating || deleteClientMutation.isPending
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => client.id && handleDelete(client.id)}
                              disabled={
                                (deleteClientMutation.isPending &&
                                  deleteClientMutation.variables === client.id) ||
                                isMutating
                              }
                            >
                              {deleteClientMutation.isPending &&
                              deleteClientMutation.variables === client.id ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                "Excluir"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          Nenhum cliente cadastrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}



        {activeTab === "teste" && (
          <div className="info-card">
            <h2>Relatório de Clientes e Pedidos</h2>
            
            <button 
              onClick={carregarRelatorio}
              disabled={carregandoRelatorio}
              className="edit-button"
            >
              {carregandoRelatorio ? 'Carregando...' : 'Atualizar Relatório'}
            </button>

            {erroRelatorio && (
              <div className="error-message">{erroRelatorio}</div>
            )}

            {relatorio && (
              <div className="relatorio-content">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Total Clientes:</span>
                    <span className="info-value">{relatorio.clientes.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Pedidos:</span>
                    <span className="info-value">{relatorio.pedidos.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Livros:</span>
                    <span className="info-value">{relatorio.livros.length}</span>
                  </div>
                </div>

                <h3>Top Clientes</h3>
                <div className="orders-list">
  {relatorio.clientes_pedidos
    ?.filter((cliente: { total_pedidos: any; }) => (cliente.total_pedidos ?? 0) > 0) // Filtra apenas clientes com total_pedidos > 0
    .slice(0, Math.min(relatorio.clientes_pedidos?.filter((c: { total_pedidos: any; }) => (c.total_pedidos ?? 0) > 0).length, 3)) // Pega no máximo 3, mas menos se não houver
    .map((cliente: {
      cliente_id: number;
      cliente_nome: string;
      total_pedidos?: number | null;
      valor_total_gasto?: number | null;
      ultima_compra?: string | null;
    }) => (
      <div key={cliente.cliente_id} className="order-card">
        <div className="order-header">
          <span>{cliente.cliente_nome}</span>
          <span>Pedidos: {cliente.total_pedidos ?? 0}</span>
        </div>
        <div className="order-footer">
          <span>Valor Total: R$ {(Number(cliente.valor_total_gasto) || 0).toFixed(2)}</span>
          <span>Última Compra: {formatarDataExibicao(cliente.ultima_compra ?? undefined)}</span>
        </div>
      </div>
    ))}
</div>
                <h3>Últimos Pedidos</h3>
                <div className="orders-list">
                  {relatorio.pedidos.slice(0, 5).map((pedido: { cliente_id: any; id: boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.Key | null | undefined; status: string; data: string | undefined; total: number; }) => {
                    const cliente = relatorio.clientes.find((c: { id: number; nome: string }) => c.id === pedido.cliente_id);
                    return (
                      <div key={String(pedido.id)} className="order-card">
                        <div className="order-header">
                          <span>Pedido #{pedido.id}</span>
                          <span>{cliente?.nome || 'Cliente não encontrado'}</span>
                          <span className={`status-${pedido.status?.toLowerCase() || 'pendente'}`}>
                            {pedido.status || 'Pendente'}
                          </span>
                        </div>
                        <div className="order-footer">
                          <span>Data: {formatarDataExibicao(pedido.data)}</span>
                          <span>Total: R$ {(Number(pedido.total) ?? 0).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Clients;