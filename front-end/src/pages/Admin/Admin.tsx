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
        path: "/livros",
        color: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)" // SaddleBrown para Sienna
      },
      {
        title: "Gerenciamento de Autores",
        description: "Adicione, edite e remova autores",
        icon: "fas fa-feather-alt",
        path: "/autores",
        color: "linear-gradient(135deg, #A0522D 0%, #CD853F 100%)" // Sienna para Peru
      },
      {
        title: "Gerenciamento de Editoras",
        description: "Administre editoras do catálogo",
        icon: "fas fa-building",
        path: "/editoras",
        color: "linear-gradient(135deg, #D2B48C 0%, #BC8F8F 100%)" // Tan para RosyBrown
      },
      {
        title: "Gerenciamento de Clientes",
        description: "Gerencie seus clientes",
        icon: "fas fa-users",
        path: "/clients",
        color: "linear-gradient(135deg, #5C4033 0%, #8B5E3C 100%)" // Dark brown to medium brown
      },
      {
        title: "Gerenciamento de Pedidos",
        description: "Gerencie pedidos e vendas",
        icon: "fas fa-receipt",
        path: "/orders",
        color: "linear-gradient(135deg, #DEB887 0%, #F5DEB3 100%)" // BurlyWood to Wheat
      },
      {
        title: "Relatórios",
        description: "Acesse relatórios e estatísticas",
        icon: "fas fa-chart-bar",
        path: "/reports",
        color: "linear-gradient(135deg, #FFF8F0 0%, #DCC5B1 100%)" // branco puxado para bege claro
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