import { useNavigate } from 'react-router-dom';
import './Home.css'; // Importando o CSS

const Home = () => {
    const navigate = useNavigate();  // Alterando para useNavigate

    const navigateToAdmin = () => {
        navigate('/admin');  // Usando navigate para redirecionar
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Bem-vindo à Livraria da Luana e do Lucas!</h1>
            <p className="home-description">Gerencie livros, clientes e pedidos de forma fácil.</p>
            <button className="admin-button" onClick={navigateToAdmin}>Sou Funcionário</button>
        </div>
    );
};

export default Home;
