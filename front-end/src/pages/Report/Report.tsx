import { useMemo } from "react";
import { RelatorioService } from "../../services/relatorio";
import { useQuery } from "@tanstack/react-query";
import { sumBy } from "lodash";
import { ReportGlobalStyles } from "./styles";
import Navbar from "../../components/NavBar"; // Assuming Navbar should be here

export default function Report() {
  // Use React Query to fetch report data
  const {
    data: dados,
    isLoading: carregando,
    isError,
    error,
  } = useQuery({
    queryKey: ["relatorio"],
    queryFn: RelatorioService.obter,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Memoized calculations, depend on 'dados' from useQuery
  const clientCounts = useMemo(() => dados?.clientes?.length ?? 0, [dados]);
  const bookCounts = useMemo(() => dados?.livros?.length ?? 0, [dados]);
  const orderCounts = useMemo(() => dados?.pedidos?.length ?? 0, [dados]);
  const authorCounts = useMemo(() => dados?.autores?.length ?? 0, [dados]);
  const publisherCounts = useMemo(() => dados?.editoras?.length ?? 0, [dados]);

  const totalRevenue = useMemo(() => {
    if (!dados?.pedidos) return "R$ 0,00";
    const num = sumBy(dados.pedidos, (pedido) => pedido.total ?? 0);
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [dados]);

  const avgClientSpend = useMemo(() => {
    if (!dados?.pedidos || orderCounts === 0) return "R$ 0,00";
    const total = sumBy(dados.pedidos, (pedido) => pedido.total ?? 0);
    // Calculate average spend per *order*, not per client directly unless client data is linked to orders easily
    const num = total / orderCounts;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [dados, orderCounts]);

  const avgBookPrice = useMemo(() => {
    if (!dados?.livros || bookCounts === 0) return "R$ 0,00";
    const num = sumBy(dados.livros, (livro) => livro.preco ?? 0) / bookCounts;
    return Number.isNaN(num)
      ? "R$ 0,00"
      : num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [dados, bookCounts]);

  const avgOrderByClient = useMemo(() => {
    if (clientCounts === 0 || orderCounts === 0) return "0.00";
    const num = orderCounts / clientCounts;
    return Number.isNaN(num) ? "0.00" : num.toFixed(2);
  }, [orderCounts, clientCounts]);

  // Render loading state
  if (carregando) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Carregando relatório...
        </div>
      </>
    );
  }

  // Render error state
  if (isError) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Erro ao carregar relatório:{" "}
          {(error as Error)?.message || "Erro desconhecido"}
        </div>
      </>
    );
  }

  // Render report data
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "1.5rem",
          maxWidth: "800px",
          margin: "2rem auto", // Added margin top/bottom
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem", // Increased gap
        }}
      >
        <ReportGlobalStyles />
        <h1
          style={{
            color: "var(--primary)",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Relatório Geral da Livraria
        </h1>

        {/* Summary Section */}
        <div
          className="container" // Use class for styling
          style={{ borderBottom: "1px solid #eee", paddingBottom: "1.5rem" }}
        >
          <h2>Resumo Atual</h2>
          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong>Clientes:</strong> {clientCounts}
            </div>
            <div>
              <strong>Pedidos:</strong> {orderCounts}
            </div>
            <div>
              <strong>Livros:</strong> {bookCounts}
            </div>
            <div>
              <strong>Autores:</strong> {authorCounts}
            </div>
            <div>
              <strong>Editoras:</strong> {publisherCounts}
            </div>
          </div>
        </div>

        {/* Financial Section */}
        <div
          className="container" // Use class for styling
        >
          <h2>Indicadores Financeiros</h2>
          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong>Receita Total:</strong> {totalRevenue}
            </div>
            <div>
              <strong>Ticket Médio (por Pedido):</strong> {avgClientSpend}
            </div>
            <div>
              <strong>Preço Médio (Livro):</strong> {avgBookPrice}
            </div>
            <div>
              <strong>Pedidos Médios (por Cliente):</strong> {avgOrderByClient}
            </div>
          </div>
        </div>

        {/* You could add more sections here, e.g., top-selling books, active clients, etc. */}
        {/* These would require more complex data processing in the backend or frontend */}
      </div>
    </>
  );
}
