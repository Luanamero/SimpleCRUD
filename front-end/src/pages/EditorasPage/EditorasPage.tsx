import { useEffect, useState } from "react";
import { EditoraService } from "../../services/editoras";
import Navbar from "../../components/NavBar";
import { Livro, LivroService } from "../../services/livros";
import { AutorService } from "../../services/autores";
import { EditorasGlobalStyle } from "./styles";

const EditorasPage = () => {
  const [autores, setAutores] = useState<Record<number, string>>({});
  const [editoras, setEditoras] = useState<Record<number, string>>({});
  const [livros, setLivros] = useState<Livro[]>([]);
  const [novoAutor, setNovoAutor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [novaEditora, setNovaEditora] = useState<string>("");

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [livrosRes, autoresRes, editorasRes] = await Promise.all([
        LivroService.listar(),
        AutorService.listar(),
        EditoraService.listar(),
      ]);

      setLivros(livrosRes);
      setAutores(Object.fromEntries(autoresRes.map((a) => [a.id!, a.nome])));
      setEditoras(Object.fromEntries(editorasRes.map((e) => [e.id!, e.nome])));
      setError(null);
    } catch (err) {
      setError("Falha ao carregar dados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Operações com Editoras
  const handleCadastrarEditora = async () => {
    if (!novaEditora) {
      setError("Nome da editora não pode ser vazio");
      return;
    }
    try {
      const editoraCadastrada = await EditoraService.criar({
        nome: novaEditora,
      });
      // Atualiza editoras e recarrega livros (pois podem existir livros da nova editora)
      setEditoras({
        ...editoras,
        [editoraCadastrada.id!]: editoraCadastrada.nome,
      });
      setNovaEditora("");
      await carregarDados(); // Recarrega tudo pois pode afetar os livros
    } catch (err) {
      setError("Falha ao cadastrar editora");
      console.error(err);
    }
  };

  const handleExcluirEditora = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta editora?")) {
      try {
        await EditoraService.excluir(id);
        // Recarrega tudo pois pode afetar os livros
        await carregarDados();
      } catch (err) {
        setError("Falha ao excluir editora");
        console.error(err);
      }
    }
  };

  return (
    <div className="container">
      <EditorasGlobalStyle />
      <Navbar />
      {/* Seção Editoras */}
      <div className="management-section">
        <h2 className="section-title">
          <i className="fas fa-building"></i> Gerenciar Editoras
        </h2>

        <div className="form-group">
          <input
            type="text"
            value={novaEditora}
            onChange={(e) => setNovaEditora(e.target.value)}
            placeholder="Nome da editora"
            className="form-input"
          />
          <button onClick={handleCadastrarEditora} className="secondary-button">
            <i className="fas fa-plus"></i> Adicionar Editora
          </button>
        </div>

        <div className="list-container">
          <h3 className="list-title">Editoras Cadastradas</h3>
          <ul className="styled-list">
            {Object.entries(editoras).map(([id, nome]) => (
              <li key={id} className="list-item">
                <span>{nome}</span>
                <button
                  onClick={() => handleExcluirEditora(Number(id))}
                  className="danger-button"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditorasPage;
