

const Orders = () => {
  // Simulando dados de pedidos
  const orders = [
    { id: 1, client: 'Client 1', book: 'Book 1', date: '2023-01-01', status: 'Completed' },
    { id: 2, client: 'Client 2', book: 'Book 2', date: '2023-01-02', status: 'Processing' },
    { id: 3, client: 'Client 3', book: 'Book 3', date: '2023-01-03', status: 'Shipped' },
  ];

  return (
    <div>
      
      <div style={{ padding: '2rem' }}>
        <h1>Orders Management</h1>
        
        <div style={{ margin: '1rem 0' }}>
          <button style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Create New Order</button>
          <input type="text" placeholder="Search orders..." style={{ padding: '0.5rem' }} />
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Order ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Client</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Book</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{order.id}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{order.client}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{order.book}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{order.date}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{order.status}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                  <button style={{ marginRight: '0.5rem' }}>View</button>
                  <button>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;