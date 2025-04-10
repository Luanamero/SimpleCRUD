import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import './NavBar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <span>Livraria L&L</span>
        </Link>
      </div>
      <div className="navbar-links">
        {!isAuthenticated && (
          <>
            <Link to="/login" className="nav-link">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          </>
        )}

        {isAuthenticated && user?.role === 'customer' && (
          <>
            <Link to="/customer/profile" className="nav-link">
              <i className="fas fa-user"></i> Meu Perfil
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </>
        )}

        {isAuthenticated && user?.role === 'seller' && (
          <>
            <Link to="/admin" className="nav-link">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link to="/livros" className="nav-link">
              <i className="fas fa-book"></i> Livros
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;