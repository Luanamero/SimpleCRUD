import { useState, useMemo, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../../services/clientes";
import { usePedidosByCliente } from "../../services/pedidos";
import { useLivros } from "../../services/livros";
import FiltroLivros from "../../components/FiltroLivros/FiltroLivros";
import LivroItem from "../../components/LivroItem/LivroItem";
import { CustomerProfileGlobalStyle } from "./styles";
import { useAuth } from "../../services/auth";


const formatarDataExibicao = (dataString?: string) => {
  if (!dataString) return "N/A";
  try {
    const [year, month, day] = dataString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  } catch {
    return dataString;
  }
};

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "livros" >("profile");
  const [relatorio, setRelatorio] = useState<any>(null);
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
  const [erroRelatorio, setErroRelatorio] = useState<string | null>(null);

  const {
    data: customer,
    isLoading: customerLoading,
    isError: customerError,
    error: customerQueryError,
  } = useCliente(user?.id ?? 0);

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersQueryError,
  } = usePedidosByCliente(user?.id ?? 0);

  const {
    data: livros = [],
    isLoading: livrosLoading,
    isError: livrosError,
    error: livrosQueryError,
  } = useLivros();

  const [filtro, setFiltro] = useState({
    nome: "",
    genero: "",
    precoMin: 0,
    precoMax: 999999,
    estoqueBaixo: false,
  });

  const livrosFiltrados = useMemo(() => {
    return livros.filter((livro) => {
      const nomeMatch = livro.titulo.toLowerCase().includes(filtro.nome.toLowerCase());
      const generoMatch = (livro.genero || "").toLowerCase().includes(filtro.genero.toLowerCase());
      const precoMatch = livro.preco >= filtro.precoMin && livro.preco <= filtro.precoMax;
      const stockMatch = livro.estoque > 0;

      return nomeMatch && generoMatch && precoMatch && stockMatch;
    });
  }, [livros, filtro]);



  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isLoading = authLoading || customerLoading || ordersLoading || livrosLoading;
  const isError = customerError || ordersError || livrosError;
  const errorMessage = (customerQueryError as Error)?.message || 
                      (ordersQueryError as Error)?.message || 
                      (livrosQueryError as Error)?.message || 
                      "Erro ao carregar dados.";

  if (isLoading) {
    return <div className="loading" style={{ textAlign: "center", padding: "2rem" }}>Carregando...</div>;
  }

  if (!user || !customer) {
    if (!authLoading && !user) {
      navigate("/login");
      return null;
    }
    return <div className="error" style={{ textAlign: "center", padding: "2rem", color: "red" }}>
      Erro ao carregar perfil do cliente. Tente fazer login novamente.
    </div>;
  }

  if (isError) {
    return <div className="error" style={{ textAlign: "center", padding: "2rem", color: "red" }}>{errorMessage}</div>;
  }

  return (
    <div className="customer-profile-container">
      <CustomerProfileGlobalStyle />
      <header className="profile-header">
        <h1>Meu Perfil</h1>
        <p>Bem-vindo de volta, {customer.nome}!</p>
      </header>

      <div className="profile-tabs">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          Informações Pessoais
        </button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Meus Pedidos ({orders.length})
        </button>
        <button className={activeTab === "livros" ? "active" : ""} onClick={() => setActiveTab("livros")}>
          Explorar Livros
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
              <p>{customer.endereco || "Nenhum endereço cadastrado."}</p>
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
                <button className="browse-books" onClick={() => setActiveTab("livros")}>
                  Explorar Livros
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">Pedido #{order.id}</span>
                      <span className="order-date">{formatarDataExibicao(order.data)}</span>
                    </div>
                    <span className={`order-status status-${(order.status || "processando").toLowerCase().replace(" ", "-")}`}>
                      {order.status || "Processando"}
                    </span>
                  </div>
                  <div className="order-footer">
                    <span className="order-total">
                      Total: <span>
                        {order.total?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }) ?? "N/A"}
                      </span>
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
              onChange={(novoFiltro) => setFiltro({
                ...filtro,
                ...novoFiltro,
                estoqueBaixo: false,
              })}
            />

            {livrosLoading ? (
              <p>Carregando livros...</p>
            ) : livrosFiltrados.length > 0 ? (
              <div className="books-grid">
                {livrosFiltrados.map((livro) => (
                  <LivroItem key={livro.id} livro={livro} />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", marginTop: "2rem" }}>
                Nenhum livro encontrado com os filtros aplicados.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;