import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ 
      backgroundColor: '#333', 
      padding: '1rem',
      display: 'flex',
      gap: '1rem'
    }}>
      <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
      <Link to="/books" style={{ color: 'white', textDecoration: 'none' }}>Books</Link>
      <Link to="/clients" style={{ color: 'white', textDecoration: 'none' }}>Clients</Link>
      <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>Orders</Link>
    </nav>
  );
};

export default Navbar;