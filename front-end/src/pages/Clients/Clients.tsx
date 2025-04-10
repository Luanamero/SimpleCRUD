import React, { useState, useEffect } from "react";
import { ClienteService, Cliente } from "../../services/clientes";
import Navbar from "../../components/NavBar";
import { ClientsGlobalStyles } from "./styles";

const Clients = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newClient, setNewClient] = useState<Cliente>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });
  const [refresh, setRefresh] = useState<boolean>(false); // Estado para controlar o reload

  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsData = await ClienteService.listar();
      setClients(clientsData);
    } catch (error) {
      console.error("Erro ao carregar os clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refresh]); // Adicionamos refresh como dependência

  const handleDelete = async (id: number) => {
    try {
      await ClienteService.excluir(id);
      setRefresh((prev) => !prev); // Ativa o reload
    } catch (error) {
      console.error("Erro ao excluir o cliente:", error);
    }
  };

  const handleEdit = (client: Cliente) => {
    setNewClient({
      nome: client.nome,
      email: client.email,
      telefone: client.telefone,
      endereco: client.endereco || "",
      id: client.id,
    });
  };

  const handleSave = async () => {
    try {
      if (newClient.id) {
        await ClienteService.atualizar(newClient.id, newClient);
      } else {
        await ClienteService.criar(newClient);
      }
      setNewClient({ nome: "", email: "", telefone: "", endereco: "" });
      setRefresh((prev) => !prev); // Ativa o reload
    } catch (error) {
      console.error("Erro ao salvar o cliente:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <ClientsGlobalStyles />
      <Navbar />
      <div className="clients-container">
        <h1 className="page-title" color="#8B5E3C">
          Gerenciamento de Clientes
        </h1>

        <div className="client-form">
          <h2 className="form-title">
            {newClient.id ? "Editar Cliente" : "Adicionar Novo Cliente"}
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                value={newClient.nome}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={newClient.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                className="form-control"
                value={newClient.telefone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Endereço</label>
              <input
                type="text"
                name="endereco"
                className="form-control"
                value={newClient.endereco}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSave}>
            {newClient.id ? "Atualizar" : "Salvar"}
          </button>

          {newClient.id && (
            <button
              className="btn btn-secondary"
              onClick={() =>
                setNewClient({
                  nome: "",
                  email: "",
                  telefone: "",
                  endereco: "",
                })
              }
            >
              Cancelar
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-message">Carregando...</div>
        ) : (
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
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(client)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => client.id && handleDelete(client.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhum cliente cadastrado</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Clients;
