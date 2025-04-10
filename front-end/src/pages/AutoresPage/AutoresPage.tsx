import { useEffect, useState } from 'react';
import { AutorService } from '../../services/autores';
import { Livro, LivroService } from '../../services/livros';
import { EditoraService } from '../../services/editoras';
import Navbar from '../../components/NavBar';
import { AutoresGlobalStyle } from './styles';

const AutoresPage = () => {
  const [autores, setAutores] = useState<Record<number, string>>({});
  const [editoras, setEditoras] = useState<Record<number, string>>({});
  const [livros, setLivros] = useState<Livro[]>([]);
  const [novoAutor, setNovoAutor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [livrosRes, autoresRes, editorasRes] = await Promise.all([
        LivroService.listar(),
        AutorService.listar(),
        EditoraService.listar()
      ]);

      setLivros(livrosRes);
      setAutores(Object.fromEntries(autoresRes.map(a => [a.id!, a.nome])));
      setEditoras(Object.fromEntries(editorasRes.map(e => [e.id!, e.nome])));
      setError(null);
    } catch (err) {
      setError('Falha ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastrarAutor = async () => {
    if (!novoAutor.trim()) {
      setError('Nome do autor não pode ser vazio');
      return;
    }

    try {
      const autorCadastrado = await AutorService.criar({ nome: novoAutor });
      setAutores({ ...autores, [autorCadastrado.id!]: autorCadastrado.nome });
      setNovoAutor('');
      await carregarDados();
    } catch (err) {
      setError('Falha ao cadastrar autor');
      console.error(err);
    }
  };

  const handleExcluirAutor = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este autor?')) {
      try {
        await AutorService.excluir(id);
        await carregarDados();
      } catch (err) {
        setError('Falha ao excluir autor');
        console.error(err);
      }
    }
  };

  return (
    <div className="autores-container">
      <AutoresGlobalStyle />
      <Navbar />
      <div className="autores-section">
        <h2 className="section-title">
          <i className="fas fa-user-edit"></i> Gerenciar Autores
        </h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            type="text"
            value={novoAutor}
            onChange={(e) => setNovoAutor(e.target.value)}
            placeholder="Nome do autor"
            className="form-input"
          />
          <button onClick={handleCadastrarAutor} className="add-button">
            <i className="fas fa-plus"></i> Adicionar Autor
          </button>
        </div>

        <div className="list-section">
          <h3 className="list-title">Autores Cadastrados</h3>
          <ul className="author-list">
            {Object.entries(autores).map(([id, nome]) => (
              <li key={id} className="author-item">
                <span>{nome}</span>
                <button
                  onClick={() => handleExcluirAutor(Number(id))}
                  className="delete-button"
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

export default AutoresPage;
