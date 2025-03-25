import { useEffect, useState } from 'react';
import { Livro, LivroService } from '../services/livros';
import { AutorService } from '../services/autores';
import { EditoraService } from '../services/editoras';
import axios from 'axios';

const LivrosPage = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [autores, setAutores] = useState<Record<number, string>>({});
  const [editoras, setEditoras] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de formulário
  const [livroEdicao, setLivroEdicao] = useState<Livro | null>(null);
  const [novoLivro, setNovoLivro] = useState<Livro>({
    titulo: '',
    autor_id: 0,
    editora_id: 0,
    ano_publicacao: new Date().getFullYear(),
    estoque: 0,
    preco: 0
  });

  const [novoAutor, setNovoAutor] = useState<string>('');
  const [novaEditora, setNovaEditora] = useState<string>('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [livrosRes, autoresRes, editorasRes] = await Promise.all([
          LivroService.listar(),
          AutorService.listar(),
          EditoraService.listar()
        ]);

        setLivros(livrosRes);

        setAutores(autoresRes.reduce((acc, autor) => {
          acc[autor.id!] = autor.nome;
          return acc;
        }, {} as Record<number, string>));

        setEditoras(editorasRes.reduce((acc, editora) => {
          acc[editora.id!] = editora.nome;
          return acc;
        }, {} as Record<number, string>));

      } catch (err) {
        setError('Falha ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await LivroService.excluir(id);
        setLivros(livros.filter(livro => livro.id !== id));
      } catch (err) {
        setError('Falha ao excluir livro');
        console.error(err);
      }
    }
  };

  const handleCadastrarLivro = async () => {
    try {
      const novoLivroCadastrado = await LivroService.criar(novoLivro);
      setLivros([...livros, novoLivroCadastrado]);
      setNovoLivro({
        titulo: '',
        autor_id: 0,
        editora_id: 0,
        ano_publicacao: new Date().getFullYear(),
        estoque: 0,
        preco: 0,
      });
    } catch (err) {
      setError('Falha ao cadastrar livro');
      console.error(err);
    }
  };

  const handleEditarLivro = async () => {
    if (livroEdicao?.id) {
      try {
        const livroAtualizado = await LivroService.atualizar(livroEdicao.id, livroEdicao);
        setLivros(livros.map(livro => livro.id === livroAtualizado.id ? livroAtualizado : livro));
        setLivroEdicao(null);
      } catch (err) {
        setError('Falha ao editar livro');
        console.error(err);
      }
    } else {
      setError('Livro não encontrado para edição');
    }
  };

  const handleCadastrarAutor = async () => {
    if (!novoAutor) {
      setError('Nome do autor não pode ser vazio');
      return;
    }
    try {
      const autorCadastrado = await AutorService.criar({ nome: novoAutor });
      setAutores({ ...autores, [autorCadastrado.id!]: autorCadastrado.nome });
      setNovoAutor('');
    } catch (err) {
      setError('Falha ao cadastrar autor');
      console.error(err);
    }
  };

  const handleExcluirAutor = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este autor?')) {
      try {
        await AutorService.excluir(id);
        setAutores(prevAutores => {
          const updatedAutores = { ...prevAutores };
          delete updatedAutores[id];
          return updatedAutores;
        });
      } catch (err) {
        setError('Falha ao excluir autor');
        console.error(err);
      }
    }
  };

  const handleCadastrarEditora = async () => {
    if (!novaEditora) {
      setError('Nome da editora não pode ser vazio');
      return;
    }
    try {
      const editoraCadastrada = await EditoraService.criar({ nome: novaEditora });
      setEditoras({ ...editoras, [editoraCadastrada.id!]: editoraCadastrada.nome });
      setNovaEditora('');
    } catch (err) {
      setError('Falha ao cadastrar editora');
      console.error(err);
    }
  };

  const handleExcluirEditora = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta editora?')) {
      try {
        await EditoraService.excluir(id);
        setEditoras(prevEditoras => {
          const updatedEditoras = { ...prevEditoras };
          delete updatedEditoras[id];
          return updatedEditoras;
        });
      } catch (err) {
        setError('Falha ao excluir editora');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Livros</h1>

      {/* Formulário de Cadastro de Livro */}
      <div>
        <h2>{livroEdicao ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h2>
        <input
          type="text"
          value={livroEdicao ? livroEdicao.titulo : novoLivro.titulo}
          onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, titulo: e.target.value }) : setNovoLivro({ ...novoLivro, titulo: e.target.value }))}
          placeholder="Título"
        />
        <select
          value={livroEdicao ? livroEdicao.autor_id : novoLivro.autor_id || ''}
          onChange={(e) => {
            const autorId = Number(e.target.value);
            if (livroEdicao) {
              setLivroEdicao({ ...livroEdicao, autor_id: autorId });
            } else {
              setNovoLivro({ ...novoLivro, autor_id: autorId });
            }
          }}
        >
          <option value="">Selecione um autor</option>
          {Object.entries(autores).map(([id, nome]) => (
            <option key={id} value={id}>{nome}</option>
          ))}
        </select>

        <select
          value={livroEdicao ? livroEdicao.editora_id : novoLivro.editora_id || ''}
          onChange={(e) => {
            const editoraId = Number(e.target.value);
            if (livroEdicao) {
              setLivroEdicao({ ...livroEdicao, editora_id: editoraId });
            } else {
              setNovoLivro({ ...novoLivro, editora_id: editoraId });
            }
          }}
        >
          <option value="">Selecione uma editora</option>
          {Object.entries(editoras).map(([id, nome]) => (
            <option key={id} value={id}>{nome}</option>
          ))}
        </select>

        <input
          type="number"
          value={livroEdicao ? livroEdicao.ano_publicacao : novoLivro.ano_publicacao}
          onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, ano_publicacao: Number(e.target.value) }) : setNovoLivro({ ...novoLivro, ano_publicacao: Number(e.target.value) }))}
          placeholder="Ano de Publicação"
        />
        <button onClick={livroEdicao ? handleEditarLivro : handleCadastrarLivro}>
          {livroEdicao ? 'Salvar Alterações' : 'Cadastrar Livro'}
        </button>
      </div>

      {/* Formulário de Cadastro de Autor */}
      <div>
        <h2>Cadastrar Novo Autor</h2>
        <input
          type="text"
          value={novoAutor}
          onChange={(e) => setNovoAutor(e.target.value)}
          placeholder="Nome do autor"
        />
        <button onClick={handleCadastrarAutor}>Cadastrar Autor</button>
      </div>

      {/* Listagem de Autores */}
      <div>
        <h3>Autores</h3>
        <ul>
          {Object.entries(autores).map(([id, nome]) => (
            <li key={id}>
              {nome} <button onClick={() => handleExcluirAutor(Number(id))}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulário de Cadastro de Editora */}
      <div>
        <h2>Cadastrar Nova Editora</h2>
        <input
          type="text"
          value={novaEditora}
          onChange={(e) => setNovaEditora(e.target.value)}
          placeholder="Nome da editora"
        />
        <button onClick={handleCadastrarEditora}>Cadastrar Editora</button>
      </div>

      {/* Listagem de Editoras */}
      <div>
        <h3>Editoras</h3>
        <ul>
          {Object.entries(editoras).map(([id, nome]) => (
            <li key={id}>
              {nome} <button onClick={() => handleExcluirEditora(Number(id))}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Listagem de Livros */}
      {livros.length === 0 ? (
        <div>Não há livros cadastrados.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Editora</th>
              <th>Ano</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {livros.map(livro => (
              <tr key={livro.id}>
                <td>{livro.titulo}</td>
                <td>{autores[livro.autor_id] || 'Desconhecido'}</td>
                <td>{editoras[livro.editora_id] || 'Desconhecida'}</td>
                <td>{livro.ano_publicacao}</td>
                <td>
                  <button onClick={() => setLivroEdicao(livro)}>Editar</button>
                  <button onClick={() => handleExcluir(livro.id!)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LivrosPage;
