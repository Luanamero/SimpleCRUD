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
                className="btn btn-secondary" // Assuming a secondary button style exists
                onClick={handleCancelEdit}
                disabled={isMutating}
                style={{ background: "#6c757d", color: "white" }} // Example secondary style
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
            {" "}
            {/* Added for better table handling */}
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
                        {" "}
                        {/* Use class for styling actions */}
                        <button
                          className="btn btn-warning" // Use warning style for edit
                          onClick={() => handleEdit(client)}
                          disabled={
                            isMutating || deleteClientMutation.isPending
                          }
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger" // Use danger style for delete
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
      </div>
    </>
  );
};

export default Clients;
