import { Link } from "react-router-dom";
import './NavBar.css'; // Vamos criar este arquivo CSS

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <span>Livraria L&L</span>
      </div>
      <div className="navbar-links">
        <Link to="/admin" className="nav-link">
          <i className="fas fa-user-shield"></i> Admin
        </Link>
        <Link to="/books" className="nav-link">
          <i className="fas fa-book"></i> Livros
        </Link>
        <Link to="/clients" className="nav-link">
          <i className="fas fa-users"></i> Clientes
        </Link>
        <Link to="/orders" className="nav-link">
          <i className="fas fa-receipt"></i> Pedidos
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;