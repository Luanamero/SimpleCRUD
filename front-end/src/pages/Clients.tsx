import React, { useState, useEffect } from 'react';
import { ClienteService, Cliente } from '../services/clientes';

const Clients = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newClient, setNewClient] = useState<Cliente>({ nome: '', email: '', telefone: '', endereco: '' }); // Novo cliente

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
    setNewClient({ nome: client.nome, email: client.email, telefone: client.telefone, endereco: client.endereco || '', id: client.id });
  };

  const handleSave = async () => {
    try {
      if (newClient.id) {
        // Atualizar cliente
        const updatedClient = await ClienteService.atualizar(newClient.id, newClient);
        setClients(prevClients =>
          prevClients.map(client => (client.id === updatedClient.id ? updatedClient : client))
        );
      } else {
        // Adicionar novo cliente
        const createdClient = await ClienteService.criar(newClient);
        setClients(prevClients => [...prevClients, createdClient]);
      }
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
    setNewClient({ nome: '', email: '', telefone: '', endereco: '' }); // Resetar o formulário
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <div style={{ padding: '2rem' }}>
        <h1>Clients Management</h1>

        {/* Formulário para Adicionar Cliente */}
        {!newClient.id && (
          <div style={{ marginBottom: '2rem' }}>
            <h2>Add New Client</h2>
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Name"
                value={newClient.nome}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newClient.email}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="text"
                name="telefone"
                placeholder="Phone"
                value={newClient.telefone}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="text"
                name="endereco"
                placeholder="Address"
                value={newClient.endereco}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <button onClick={handleSave} style={{ padding: '0.5rem 1rem' }}>
                Add Client
              </button>
            </div>
          </div>
        )}

        {/* Formulário para Editar Cliente */}
        {newClient.id && (
          <div style={{ marginBottom: '2rem' }}>
            <h2>Edit Client</h2>
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Name"
                value={newClient.nome}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newClient.email}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="text"
                name="telefone"
                placeholder="Phone"
                value={newClient.telefone}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="text"
                name="endereco"
                placeholder="Address"
                value={newClient.endereco}
                onChange={handleChange}
                style={{ padding: '0.5rem', marginBottom: '1rem' }}
              />
              <button onClick={handleSave} style={{ padding: '0.5rem 1rem' }}>
                Update Client
              </button>
            </div>
          </div>
        )}

        {/* Tabela de Clientes */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Address</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '0.75rem', textAlign: 'center' }}>Loading clients...</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.nome}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.email}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.telefone}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.endereco || 'N/A'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEdit(client)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => client.id && handleDelete(client.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
