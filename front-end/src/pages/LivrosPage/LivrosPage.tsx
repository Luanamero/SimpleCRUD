import { useEffect, useState } from 'react';
import { Livro, LivroService } from '../../services/livros';
import { AutorService } from '../../services/autores';
import { EditoraService } from '../../services/editoras';
import './LivrosPage.css';
import Navbar from '../../components/NavBar';
import FiltroLivros from '../../components/FiltroLivros/FiltroLivros';

const LivrosPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [autores, setAutores] = useState<Record<number, string>>({});
  const [editoras, setEditoras] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>([]);
  const [livroEdicao, setLivroEdicao] = useState<Livro | null>(null);
  const [novoLivro, setNovoLivro] = useState<Livro>({
    titulo: '',
    autor_id: 0,
    editora_id: 0,
    ano_publicacao: new Date().getFullYear(),
    estoque: 0,
    preco: 0,
    genero: ''
  });

  const [filtros, setFiltros] = useState({
    nome: '',
    genero: '',
    precoMin: 0,
    precoMax: 999999,
    estoqueBaixo: false, // 👈 Novo filtro
  });
   

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

  useEffect(() => {
    const { nome, genero, precoMin, precoMax, estoqueBaixo } = filtros;
  
    const filtrados = livros.filter((livro) =>
      livro.titulo.toLowerCase().includes(nome.toLowerCase()) &&
      livro.genero.toLowerCase().includes(genero.toLowerCase()) &&
      livro.preco >= precoMin &&
      livro.preco <= precoMax &&
      (!estoqueBaixo || livro.estoque < 5) // 👈 Aplica o filtro só se estiver marcado
    );
  
    setLivrosFiltrados(filtrados);
  }, [livros, filtros]);
  
  
  

  const handleExcluirLivro = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await LivroService.excluir(id);
        setLivros(livros.filter(l => l.id !== id));
      } catch (err) {
        setError('Falha ao excluir livro');
        console.error(err);
      }
    }
  };

  const handleSalvarLivro = async () => {
    try {
      const livroParaSalvar = livroEdicao ?? novoLivro;

      if (!livroParaSalvar.titulo.trim()) {
        setError('O título do livro é obrigatório');
        return;
      }

      if (!livroParaSalvar.autor_id || !livroParaSalvar.editora_id) {
        setError('Selecione um autor e uma editora');
        return;
      }

      const dados = {
        ...livroParaSalvar,
        ano_publicacao: Number(livroParaSalvar.ano_publicacao) || new Date().getFullYear(),
        preco: Number(livroParaSalvar.preco) || 0,
        estoque: Number(livroParaSalvar.estoque) || 0,
        genero: livroParaSalvar.genero || 'Indefinido'
      };

      if (livroEdicao) {
        await LivroService.atualizar(livroEdicao.id!, dados);
      } else {
        const novo = await LivroService.criar(dados);
        setLivros([...livros, novo]);
      }

      setLivroEdicao(null);
      setNovoLivro({
        titulo: '',
        autor_id: 0,
        editora_id: 0,
        ano_publicacao: new Date().getFullYear(),
        estoque: 0,
        preco: 0,
        genero: ''
      });

      carregarDados();
    } catch (err) {
      setError('Erro ao salvar o livro');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <Navbar />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="formulario">
            <h3>{livroEdicao ? 'Editar Livro' : 'Novo Livro'}</h3>

            <input
              type="text"
              placeholder="Título"
              value={livroEdicao ? livroEdicao.titulo : novoLivro.titulo}
              onChange={(e) =>
                livroEdicao
                  ? setLivroEdicao({ ...livroEdicao, titulo: e.target.value })
                  : setNovoLivro({ ...novoLivro, titulo: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Ano de Publicação"
              value={livroEdicao ? livroEdicao.ano_publicacao : novoLivro.ano_publicacao}
              onChange={(e) =>
                livroEdicao
                  ? setLivroEdicao({ ...livroEdicao, ano_publicacao: Number(e.target.value) })
                  : setNovoLivro({ ...novoLivro, ano_publicacao: Number(e.target.value) })
              }
            />

            <label>
              Estoque:
              <input
                type="number"
                placeholder="Quantidade em estoque"
                value={livroEdicao ? livroEdicao.estoque : novoLivro.estoque}
                onChange={(e) =>
                  livroEdicao
                    ? setLivroEdicao({ ...livroEdicao, estoque: Number(e.target.value) })
                    : setNovoLivro({ ...novoLivro, estoque: Number(e.target.value) })
                }
              />
            </label>

            <label>
              Preço:
              <input
                type="number"
                step="0.01"
                placeholder="Preço em R$"
                value={livroEdicao ? livroEdicao.preco : novoLivro.preco}
                onChange={(e) =>
                  livroEdicao
                    ? setLivroEdicao({ ...livroEdicao, preco: Number(e.target.value) })
                    : setNovoLivro({ ...novoLivro, preco: Number(e.target.value) })
                }
              />
            </label>

            <input
              type="text"
              placeholder="Gênero"
              value={livroEdicao ? livroEdicao.genero : novoLivro.genero}
              onChange={(e) =>
                livroEdicao
                  ? setLivroEdicao({ ...livroEdicao, genero: e.target.value })
                  : setNovoLivro({ ...novoLivro, genero: e.target.value })
              }
            />

            <select
              value={livroEdicao ? livroEdicao.autor_id : novoLivro.autor_id}
              onChange={(e) => {
                const id = Number(e.target.value);
                livroEdicao
                  ? setLivroEdicao({ ...livroEdicao, autor_id: id })
                  : setNovoLivro({ ...novoLivro, autor_id: id });
              }}
            >
              <option value="">Selecione um autor</option>
              {Object.entries(autores).map(([id, nome]) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>

            <select
              value={livroEdicao ? livroEdicao.editora_id : novoLivro.editora_id}
              onChange={(e) => {
                const id = Number(e.target.value);
                livroEdicao
                  ? setLivroEdicao({ ...livroEdicao, editora_id: id })
                  : setNovoLivro({ ...novoLivro, editora_id: id });
              }}
            >
              <option value="">Selecione uma editora</option>
              {Object.entries(editoras).map(([id, nome]) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>

            <button onClick={handleSalvarLivro}>
              {livroEdicao ? 'Salvar Alterações' : 'Cadastrar Livro'}
            </button>

            {livroEdicao && (
              <button className="btn-cancelar" onClick={() => setLivroEdicao(null)}>
                Cancelar Edição
              </button>
            )}
          </div>

                    <FiltroLivros
            nome={filtros.nome}
            genero={filtros.genero}
            precoMin={filtros.precoMin}
            precoMax={filtros.precoMax}
            estoqueBaixo={filtros.estoqueBaixo}
            mostrarEstoqueBaixo={true}
            onChange={(novoFiltro) =>
              setFiltros({
                ...filtros,
                ...novoFiltro,
                estoqueBaixo: novoFiltro.estoqueBaixo ?? false, // 👈 garante boolean
              })
            }
          />



          <h2 className="section-title">Livros Cadastrados</h2>
          <ul className="lista-livros">
            {livrosFiltrados.map((livro) => (
              <li key={livro.id}>
                <span>
                  <strong>{livro.titulo}</strong> – {autores[livro.autor_id]} – {editoras[livro.editora_id]} – R$ {(Number(livro.preco) || 0).toFixed(2)}
                </span>
                <div className="botoes-livro">
                  <button onClick={() => setLivroEdicao(livro)}>Editar</button>
                  <button onClick={() => handleExcluirLivro(livro.id!)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>

          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
};

export default LivrosPage;
