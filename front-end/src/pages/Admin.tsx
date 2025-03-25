

const Admin = () => {
  return (
    <div>
    
      <div style={{ padding: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the administration panel. Use the navigation above to manage different sections.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h3>Books Management</h3>
            <p>Manage your book catalog</p>
          </div>
          
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h3>Clients Management</h3>
            <p>Manage your clients</p>
          </div>
          
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h3>Orders Management</h3>
            <p>Manage orders and sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;