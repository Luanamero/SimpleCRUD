

const Clients = () => {
  // Simulando dados de clientes
  const clients = [
    { id: 1, name: 'Client 1', email: 'client1@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Client 2', email: 'client2@example.com', phone: '234-567-8901' },
    { id: 3, name: 'Client 3', email: 'client3@example.com', phone: '345-678-9012' },
  ];

  return (
    <div>
     
      <div style={{ padding: '2rem' }}>
        <h1>Clients Management</h1>
        
        <div style={{ margin: '1rem 0' }}>
          <button style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Add New Client</button>
          <input type="text" placeholder="Search clients..." style={{ padding: '0.5rem' }} />
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.name}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.email}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{client.phone}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                  <button style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;