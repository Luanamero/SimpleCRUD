import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cliente, ClienteService } from "../../services/clientes";
import { Pedido, PedidoService } from "../../services/pedidos";
import { Livro, LivroService } from "../../services/livros";
import FiltroLivros from "../../components/FiltroLivros/FiltroLivros";
import LivroItem from "../../components/LivroItem/LivroItem";
import { CustomerProfileGlobalStyle } from "./styles";
import { useAuth } from "../../services/auth";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [customer, setCustomer] = useState<Cliente | null>(null);
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "livros">(
    "profile"
  );

  const [livros, setLivros] = useState<Livro[]>([]);
  const [filtro, setFiltro] = useState({
    nome: "",
    genero: "",
    precoMin: 0,
    precoMax: 999999,
    estoqueBaixo: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        // Get customer details
        const customerData = await ClienteService.obter(user.id);
        setCustomer(customerData);

        // Get orders for this customer
        const resOrders = await PedidoService.listar();
        setOrders(
          resOrders.filter((order) => order.cliente_id === user.id)
        );

        // Get available books
        const resLivros = await LivroService.listar();
        setLivros(resLivros);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const livrosFiltrados = livros.filter((livro) => {
    const nomeMatch = livro.titulo
      .toLowerCase()
      .includes(filtro.nome.toLowerCase());
    const generoMatch = livro.genero
      ? livro.genero.toLowerCase().includes(filtro.genero.toLowerCase())
      : !filtro.genero;
    const precoMatch =
      livro.preco >= filtro.precoMin && livro.preco <= filtro.precoMax;

    return nomeMatch && generoMatch && precoMatch;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!customer) {
    return <div className="error">Erro ao carregar perfil do cliente.</div>;
  }

  return (
    <div className="customer-profile-container">
      <CustomerProfileGlobalStyle />
      <header className="profile-header">
        <h1>Meu Perfil</h1>
        <p>Bem-vindo de volta, {customer.nome}!</p>
      </header>

      <div className="profile-tabs">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Informações Pessoais
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Meus Pedidos ({orders.length})
        </button>
        <button
          className={activeTab === "livros" ? "active" : ""}
          onClick={() => setActiveTab("livros")}
        >
          Livros Disponíveis
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="personal-info">
            <div className="info-card">
              <h2>Dados Pessoais</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nome:</span>
                  <span className="info-value">{customer.nome}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{customer.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Telefone:</span>
                  <span className="info-value">{customer.telefone}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Endereço</h2>
              <p>{customer.endereco}</p>
              <button className="edit-button">Editar Endereço</button>
            </div>

            <div className="actions">
              <button className="change-password">Alterar Senha</button>
              <button className="logout" onClick={handleLogout}>Sair</button>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>Você ainda não fez nenhum pedido.</p>
                <button 
                  className="browse-books"
                  onClick={() => setActiveTab("livros")}
                >
                  Explorar Livros
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">Pedido #{order.id}</span>
                      <span className="order-date">{order.data}</span>
                    </div>
                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "livros" && (
          <div className="available-books">
            <h2>Livros Disponíveis</h2>

            <FiltroLivros
              nome={filtro.nome}
              genero={filtro.genero}
              precoMin={filtro.precoMin}
              precoMax={filtro.precoMax}
              onChange={(novoFiltro) =>
                setFiltro({
                  ...novoFiltro,
                  estoqueBaixo: novoFiltro.estoqueBaixo ?? false,
                })
              }
            />

            <div className="books-grid">
              {livrosFiltrados.map((livro) => (
                <LivroItem key={livro.id} livro={livro} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
