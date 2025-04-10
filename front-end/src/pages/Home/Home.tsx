import { useNavigate } from "react-router-dom";
import libraryImage from "../../assets/library.jpg"; // Ajuste o caminho conforme sua estrutura
import { HomeGlobalStyles } from "./styles";

const Home = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <HomeGlobalStyles />
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="home-title">Livraria Luana & Lucas</h1>
          <p className="home-subtitle">Sua jornada literária começa aqui</p>
        </div>

        <div className="image-container">
          <img src={libraryImage} alt="Biblioteca" className="library-image" />
        </div>

        <div className="button-section">
          <button className="explore-button" onClick={navigateToLogin}>
            Acessar Minha Conta
          </button>
        </div>

        <div className="features">
          <div className="feature">
            <span>📚</span>
            <p>Milhares de títulos</p>
          </div>
          <div className="feature">
            <span>🚚</span>
            <p>Entrega rápida</p>
          </div>
          <div className="feature">
            <span>💳</span>
            <p>Pagamento seguro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
