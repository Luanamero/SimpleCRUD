import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const adminCards = [
    {
      title: "Gerenciamento de Livros",
      description: "Gerencie seu catálogo de livros",
      icon: "fas fa-book",
      path: "/books",
      color: "linear-gradient(135deg, #7b2cbf 0%, #5b207a 100%)"
    },
    {
      title: "Gerenciamento de Clientes",
      description: "Gerencie seus clientes",
      icon: "fas fa-users",
      path: "/clients",
      color: "linear-gradient(135deg, #2c3e50 0%, #4a6491 100%)"
    },
    {
      title: "Gerenciamento de Pedidos",
      description: "Gerencie pedidos e vendas",
      icon: "fas fa-receipt",
      path: "/orders",
      color: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)"
    },
    {
      title: "Relatórios",
      description: "Acesse relatórios e estatísticas",
      icon: "fas fa-chart-bar",
      path: "/reports",
      color: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)"
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-title">Painel Administrativo</h1>
        <p className="admin-subtitle">Bem-vindo ao painel de administração. Utilize os cartões abaixo para gerenciar diferentes seções.</p>
        
        <div className="admin-grid">
          {adminCards.map((card, index) => (
            <div 
              key={index}
              className="admin-card"
              onClick={() => navigateTo(card.path)}
              style={{ background: card.color }}
            >
              <div className="card-icon">
                <i className={card.icon}></i>
              </div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
              <div className="card-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;