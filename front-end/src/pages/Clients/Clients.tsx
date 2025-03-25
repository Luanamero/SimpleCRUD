import React, { useState, useEffect } from 'react';
import { ClienteService, Cliente } from '../../services/clientes';
import './Clients.css'; // Import the CSS file
import Navbar from '../../components/NavBar';

const Clients = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newClient, setNewClient] = useState<Cliente>({ 
    nome: '', 
    email: '', 
    telefone: '', 
    endereco: '' 
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await ClienteService.listar();
        setClients(clientsData);
      } catch (error) {
        console.error('Erro ao carregar os clientes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await ClienteService.excluir(id);
      setClients(prevClients => prevClients.filter(client => client.id !== id));
    } catch (error) {
      console.error('Erro ao excluir o cliente:', error);
    }
  };

  const handleEdit = (client: Cliente) => {
    setNewClient({ 
      nome: client.nome, 
      email: client.email, 
      telefone: client.telefone, 
      endereco: client.endereco || '', 
      id: client.id 
    });
  };

  const handleSave = async () => {
    try {
      if (newClient.id) {
        // Update client
        const updatedClient = await ClienteService.atualizar(newClient.id, newClient);
        setClients(prevClients =>
          prevClients.map(client => (client.id === updatedClient.id ? updatedClient : client))
        );
      } else {
        // Add new client
        const createdClient = await ClienteService.criar(newClient);
        setClients(prevClients => [...prevClients, createdClient]);
      }
      // Reset form
      setNewClient({ nome: '', email: '', telefone: '', endereco: '' });
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prevState: any) => ({ ...prevState, [name]: value }));
  };

  return (
      <><Navbar /><div className="clients-container">
      <h1 className="page-title">Gerenciamento de Clientes</h1>

      {/* Client Form */}
      <div className="client-form">
        <h2 className="form-title">
          {newClient.id ? 'Edit Client' : 'Add New Client'}
        </h2>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              name="nome"
              className="form-control"
              placeholder="Nome"
              value={newClient.nome}
              onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={newClient.email}
              onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="text"
              name="telefone"
              className="form-control"
              placeholder="Telefone"
              value={newClient.telefone}
              onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              type="text"
              name="endereco"
              className="form-control"
              placeholder="Endereço"
              value={newClient.endereco}
              onChange={handleChange} />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
        >
          {newClient.id ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </button>

        {newClient.id && (
          <button
            className="btn btn-danger"
            style={{ marginLeft: '0.5rem' }}
            onClick={() => setNewClient({ nome: '', email: '', telefone: '', endereco: '' })}
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="loading-message">Carregando Clientes...</div>
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
              clients.map(client => (
                <tr key={client.id}>
                  <td>{client.nome}</td>
                  <td>{client.email}</td>
                  <td>{client.telefone}</td>
                  <td>{client.endereco || 'N/A'}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => client.id && handleDelete(client.id)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div></>
  );
};

export default Clients;