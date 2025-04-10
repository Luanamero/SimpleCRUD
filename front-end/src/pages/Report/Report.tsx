import { useCallback, useEffect, useMemo, useState } from "react";
import { Relatorio, RelatorioService } from "../../services/relatorio";
import { sumBy } from "lodash";
import { ReportGlobalStyles } from "./styles";

export default function Report() {
  const [carregando, setCarregando] = useState<boolean>(true);
  const [dados, setDados] = useState<Relatorio | null>(null);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const d = await RelatorioService.obter();

      setDados(d);
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, []);

  const clientCounts = useMemo(() => dados?.clientes.length ?? 0, [dados]);
  const bookCounts = useMemo(() => dados?.livros.length ?? 0, [dados]);
  const orderCounts = useMemo(() => dados?.pedidos.length ?? 0, [dados]);
  const authorCounts = useMemo(() => dados?.autores.length ?? 0, [dados]);
  const publisherCounts = useMemo(() => dados?.editoras.length ?? 0, [dados]);

  const totalRevenue = useMemo(() => {
    if (!dados) return 0;

    const num = sumBy(dados?.pedidos, (pedido) => pedido.total ?? 0);

    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [dados]);

  const avgClientSpend = useMemo(() => {
    if (!dados) return 0;

    const num =
      sumBy(dados?.pedidos, (pedido) => pedido.total ?? 0) / orderCounts;

    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [dados, orderCounts]);

  const avgBookPrice = useMemo(() => {
    if (!dados) return 0;

    const num = sumBy(dados?.livros, (livro) => livro.preco ?? 0) / bookCounts;

    return Number.isNaN(num)
      ? "R$ 0,00"
      : num.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  }, [dados, bookCounts]);

  const avgOrderByClient = useMemo(() => {
    if (!dados) return 0;

    const num = orderCounts / clientCounts;

    return Number.isNaN(num) ? "R$ 0,00" : num.toFixed(2);
  }, [dados, orderCounts, clientCounts]);

  return carregando ? (
    "Carregando..."
  ) : (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <ReportGlobalStyles />
      <h1 style={{ color: "var(--primary)" }}>Relatório da biblioteca</h1>
      <div
        className="container"
        style={{
          borderBottom: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2>Atualmente possuímos:</h2>
        <div>{clientCounts} clientes</div>
        <div>Totalizando {orderCounts} compras realizadas</div>
        <div>Sobre o total de {bookCounts} livros disponíveis</div>
        <div>Publicados por {authorCounts} autores diferentes</div>
        <div>E {publisherCounts} editoras diferentes!</div>
      </div>
      <div
        className="container"
        style={{
          borderBottom: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2>Com isso conseguimos:</h2>
        <div>Um total de {totalRevenue} em vendas</div>
        <div>Com um ticket médio de {avgClientSpend} por cliente</div>
        <div>Um preço médio de {avgBookPrice} por livro</div>
        <div>E uma média de {avgOrderByClient} compras por cliente!</div>
      </div>
    </div>
  );
}
