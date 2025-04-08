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
      </div>
    </nav>
  );
};

export default Navbar;