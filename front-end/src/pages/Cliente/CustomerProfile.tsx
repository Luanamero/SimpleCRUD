import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../../services/clientes"; // Use specific client hook
import { usePedidosByCliente } from "../../services/pedidos"; // Use orders by client hook
import { useLivros } from "../../services/livros"; // Use books hook
import FiltroLivros from "../../components/FiltroLivros/FiltroLivros";
import LivroItem from "../../components/LivroItem/LivroItem";
import { CustomerProfileGlobalStyle } from "./styles";
import { useAuth } from "../../services/auth";

// Helper function to format date for display
const formatarDataExibicao = (dataString?: string) => {
  if (!dataString) return "N/A";
  try {
    // Assuming dataString is YYYY-MM-DD or compatible
    const [year, month, day] = dataString.split("-").map(Number);
    // Use UTC to avoid timezone issues with date-only strings
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
      "pt-BR",
      { timeZone: "UTC" }
    );
  } catch {
    return dataString; // Fallback if parsing fails
  }
};

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth(); // Get user and logout from auth context
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "livros">(
    "profile"
  );

  // Fetch customer data using useCliente hook, enabled only if user exists
  const {
    data: customer,
    isLoading: customerLoading,
    isError: customerError,
    error: customerQueryError,
  } = useCliente(user?.id ?? 0);

  // Fetch orders using usePedidosByCliente hook, enabled only if user exists
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersQueryError,
  } = usePedidosByCliente(user?.id ?? 0);

  // Fetch all books
  const {
    data: livros = [],
    isLoading: livrosLoading,
    isError: livrosError,
    error: livrosQueryError,
  } = useLivros();

  // Filter state for books
  const [filtro, setFiltro] = useState({
    nome: "",
    genero: "",
    precoMin: 0,
    precoMax: 999999,
    estoqueBaixo: false, // Note: estoqueBaixo filter might not be needed for customer view
  });

  // Memoized filtered books
  const livrosFiltrados = useMemo(() => {
    return livros.filter((livro) => {
      const nomeMatch = livro.titulo
        .toLowerCase()
        .includes(filtro.nome.toLowerCase());
      const generoMatch = (livro.genero || "")
        .toLowerCase()
        .includes(filtro.genero.toLowerCase());
      const precoMatch =
        livro.preco >= filtro.precoMin && livro.preco <= filtro.precoMax;
      // Add stock check if needed, e.g., only show books in stock
      const stockMatch = livro.estoque > 0;

      return nomeMatch && generoMatch && precoMatch && stockMatch;
    });
  }, [livros, filtro]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Combined loading state
  const isLoading =
    authLoading || customerLoading || ordersLoading || livrosLoading;
  // Combined error state
  const isError = customerError || ordersError || livrosError;
  const errorMessage =
    (customerQueryError as Error)?.message ||
    (ordersQueryError as Error)?.message ||
    (livrosQueryError as Error)?.message ||
    "Erro ao carregar dados.";

  if (isLoading) {
    return (
      <div className="loading" style={{ textAlign: "center", padding: "2rem" }}>
        Carregando...
      </div>
    );
  }

  // Handle case where user is not logged in or customer data failed to load
  if (!user || !customer) {
    // You might want to redirect to login here if user is null after loading
    if (!authLoading && !user) {
      navigate("/login");
      return null; // Avoid rendering anything while redirecting
    }
    return (
      <div
        className="error"
        style={{ textAlign: "center", padding: "2rem", color: "red" }}
      >
        Erro ao carregar perfil do cliente. Tente fazer login novamente.
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="error"
        style={{ textAlign: "center", padding: "2rem", color: "red" }}
      >
        {errorMessage}
      </div>
    );
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
              {/* Add Edit Profile Button - Functionality needs implementation */}
              {/* <button className="edit-button" style={{ marginTop: '1rem' }}>Editar Perfil</button> */}
            </div>

            <div className="info-card">
              <h2>Endereço</h2>
              <p>{customer.endereco || "Nenhum endereço cadastrado."}</p>
              {/* Add Edit Address Button - Functionality needs implementation */}
              <button className="edit-button">Editar Endereço</button>
            </div>

            <div className="actions" style={{ gridColumn: "1 / -1" }}>
              {" "}
              {/* Ensure actions span full width */}
              {/* Add Change Password Button - Functionality needs implementation */}
              <button className="change-password">Alterar Senha</button>
              <button className="logout" onClick={handleLogout}>
                Sair
              </button>
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
                      <span className="order-date">
                        {formatarDataExibicao(order.data)}
                      </span>
                    </div>
                    <span
                      className={`order-status status-${(
                        order.status || "processando"
                      )
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status || "Processando"}
                    </span>
                  </div>
                  {/* TODO: Display order items here if needed */}
                  {/* You would need to fetch items for each order or have them included */}
                  <div className="order-footer">
                    {/* <button className="order-details">Ver Detalhes</button> */}
                    <span className="order-total">
                      Total:{" "}
                      <span>
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
              // Pass only relevant filters for customer view
              // estoqueBaixo={filtro.estoqueBaixo} // Likely not needed for customer
              // mostrarEstoqueBaixo={false} // Hide this option
              onChange={(novoFiltro) =>
                setFiltro({
                  ...filtro, // Keep existing filters
                  ...novoFiltro, // Apply new filters from component
                  // Ensure estoqueBaixo isn't accidentally set if component sends it
                  estoqueBaixo: false,
                })
              }
            />

            {livrosLoading ? (
              <p>Carregando livros...</p>
            ) : livrosFiltrados.length > 0 ? (
              <div
                className="books-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {livrosFiltrados.map((livro) => (
                  // Assuming LivroItem takes livro and potentially an onAddToCart prop
                  <LivroItem
                    key={livro.id}
                    livro={livro} /* onAddToCart={handleAddToCart} */
                  />
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
