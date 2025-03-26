import { useEffect, useState } from 'react';
import { Livro, LivroService } from '../../services/livros';
import { AutorService } from '../../services/autores';
import { EditoraService } from '../../services/editoras';
import './Books.css';
import Navbar from '../../components/NavBar';

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
    preco: 0,
    genero: ''
  });

  const [novoAutor, setNovoAutor] = useState<string>('');
  const [novaEditora, setNovaEditora] = useState<string>('');

  // Função para carregar todos os dados
  const carregarDados = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    carregarDados();
  }, []);

  // Operações com Livros
  const handleExcluirLivro = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await LivroService.excluir(id);
        setLivros(livros.filter(livro => livro.id !== id));
        window.location.reload()
      } catch (err) {
        setError('Falha ao excluir livro');
        console.error(err);
      }
    }
  };

  const handleCadastrarLivro = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!novoLivro.titulo.trim()) {
        setError('O título do livro é obrigatório');
        return;
      }
      
      if (!novoLivro.autor_id || !novoLivro.editora_id) {
        setError('Selecione um autor e uma editora');
        return;
      }
  
      // Cria o livro no servidor
      const livroCadastrado = await LivroService.criar({
        ...novoLivro,
        ano_publicacao: Number(novoLivro.ano_publicacao) || new Date().getFullYear(),
        preco: Number(novoLivro.preco) || 0,
        estoque: Number(novoLivro.estoque) || 0,
        genero: novoLivro.genero || "undefined"
      });
  
      // Atualiza o estado com o novo livro completo
      setLivros([...livros, livroCadastrado]);



      window.location.reload()
  
      // Reseta o formulário
      setNovoLivro({
        titulo: '',
        autor_id: 0,
        editora_id: 0,
        ano_publicacao: new Date().getFullYear(),
        estoque: 0,
        preco: 0,
        genero: ''
      });
  
    } catch (err) {
      setError('Falha ao cadastrar livro');
      console.error(err);
    }
  };

  const handleEditarLivro = async () => {
    if (!livroEdicao?.id) {
      setError('Livro não encontrado para edição');
      return;
    }
  
    try {
      // Validação básica dos campos
      if (!livroEdicao.titulo?.trim()) {
        setError('O título do livro é obrigatório');
        return;
      }
  
      if (!livroEdicao.autor_id || !livroEdicao.editora_id) {
        setError('Selecione um autor e uma editora válidos');
        return;
      }
  
      // Garante que os números são válidos
      const dadosAtualizacao = {
        ...livroEdicao,
        ano_publicacao: Number(livroEdicao.ano_publicacao) || new Date().getFullYear(),
        preco: Number(livroEdicao.preco) || 0,
        estoque: Number(livroEdicao.estoque) || 0,
        genero: livroEdicao.genero || undefined
      };
  
      // Chama o serviço de atualização
      await LivroService.atualizar(livroEdicao.id, dadosAtualizacao);
  
      window.location.reload(); // Recarrega a página
  
    } catch (err) {
      setError('Falha ao editar livro');
      console.error('Erro na edição do livro:', err);
    }
  };

  // Operações com Autores
  const handleCadastrarAutor = async () => {
    if (!novoAutor) {
      setError('Nome do autor não pode ser vazio');
      return;
    }
    try {
      const autorCadastrado = await AutorService.criar({ nome: novoAutor });
      // Atualiza autores e recarrega livros (pois podem existir livros do novo autor)
      setAutores({ ...autores, [autorCadastrado.id!]: autorCadastrado.nome });
      setNovoAutor('');
      await carregarDados(); // Recarrega tudo pois pode afetar os livros
    } catch (err) {
      setError('Falha ao cadastrar autor');
      console.error(err);
    }
  };

  const handleExcluirAutor = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este autor?')) {
      try {
        await AutorService.excluir(id);
        // Recarrega tudo pois pode afetar os livros
        await carregarDados();
      } catch (err) {
        setError('Falha ao excluir autor');
        console.error(err);
      }
    }
  };

  // Operações com Editoras
  const handleCadastrarEditora = async () => {
    if (!novaEditora) {
      setError('Nome da editora não pode ser vazio');
      return;
    }
    try {
      const editoraCadastrada = await EditoraService.criar({ nome: novaEditora });
      // Atualiza editoras e recarrega livros (pois podem existir livros da nova editora)
      setEditoras({ ...editoras, [editoraCadastrada.id!]: editoraCadastrada.nome });
      setNovaEditora('');
      await carregarDados(); // Recarrega tudo pois pode afetar os livros
    } catch (err) {
      setError('Falha ao cadastrar editora');
      console.error(err);
    }
  };

  const handleExcluirEditora = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta editora?')) {
      try {
        await EditoraService.excluir(id);
        // Recarrega tudo pois pode afetar os livros
        await carregarDados();
      } catch (err) {
        setError('Falha ao excluir editora');
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Carregando dados...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <i className="fas fa-exclamation-triangle"></i>
      <p>Erro: {error}</p>
      <button onClick={() => window.location.reload()}>Tentar novamente</button>
    </div>
  );

  return (
    <><Navbar /><div className="livros-container">
          <h1 className="page-title">
              <i className="fas fa-book"></i> Gerenciamento de Livros
          </h1>

          <div className="management-sections">
              {/* Seção Livros */}
              <div className="management-section">
                  <h2 className="section-title">
                      <i className="fas fa-book-open"></i>
                      {livroEdicao ? 'Editar Livro' : 'Cadastrar Novo Livro'}
                  </h2>

                  <div className="form-group">
                      <input
                          type="text"
                          value={livroEdicao ? livroEdicao.titulo : novoLivro.titulo}
                          onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, titulo: e.target.value }) : setNovoLivro({ ...novoLivro, titulo: e.target.value }))}
                          placeholder="Título do Livro"
                          className="form-input" />
                  </div>

                  <div className="form-row">
                      <div className="form-group">
                          <select
                              value={livroEdicao ? livroEdicao.autor_id : novoLivro.autor_id || ''}
                              onChange={(e) => {
                                  const autorId = Number(e.target.value);
                                  if (livroEdicao) {
                                      setLivroEdicao({ ...livroEdicao, autor_id: autorId });
                                  } else {
                                      setNovoLivro({ ...novoLivro, autor_id: autorId });
                                  }
                              } }
                              className="form-select"
                          >
                              <option value="">Selecione um autor</option>
                              {Object.entries(autores).map(([id, nome]) => (
                                  <option key={id} value={id}>{nome}</option>
                              ))}
                          </select>
                      </div>

                      <div className="form-group">
                          <select
                              value={livroEdicao ? livroEdicao.editora_id : novoLivro.editora_id || ''}
                              onChange={(e) => {
                                  const editoraId = Number(e.target.value);
                                  if (livroEdicao) {
                                      setLivroEdicao({ ...livroEdicao, editora_id: editoraId });
                                  } else {
                                      setNovoLivro({ ...novoLivro, editora_id: editoraId });
                                  }
                              } }
                              className="form-select"
                          >
                              <option value="">Selecione uma editora</option>
                              {Object.entries(editoras).map(([id, nome]) => (
                                  <option key={id} value={id}>{nome}</option>
                              ))}
                          </select>
                      </div>
                  </div>

                  <div className="form-row">
                      <div className="form-group">
                          <input
                              type="number"
                              value={livroEdicao ? livroEdicao.ano_publicacao : novoLivro.ano_publicacao}
                              onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, ano_publicacao: Number(e.target.value) }) : setNovoLivro({ ...novoLivro, ano_publicacao: Number(e.target.value) }))}
                              placeholder="Ano de Publicação"
                              className="form-input"
                              min="0" />
                      </div>

                      <div className="form-group">
                          <input
                              type="number"
                              value={livroEdicao ? livroEdicao.preco : novoLivro.preco}
                              onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, preco: Number(e.target.value) }) : setNovoLivro({ ...novoLivro, preco: Number(e.target.value) }))}
                              placeholder="Preço"
                              className="form-input"
                              step="0.01"
                              min="0" />
                      </div>
                  </div>

                  <div className="form-row">
                      <div className="form-group">
                          <input
                              type="number"
                              value={livroEdicao ? livroEdicao.estoque : novoLivro.estoque}
                              onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, estoque: Number(e.target.value) }) : setNovoLivro({ ...novoLivro, estoque: Number(e.target.value) }))}
                              placeholder="Estoque"
                              className="form-input"
                              min="0" />
                      </div>

                      <div className="form-group">
                          <input
                              type="text"
                              value={livroEdicao ? livroEdicao.genero || '' : novoLivro.genero || ''}
                              onChange={(e) => (livroEdicao ? setLivroEdicao({ ...livroEdicao, genero: e.target.value }) : setNovoLivro({ ...novoLivro, genero: e.target.value }))}
                              placeholder="Gênero (opcional)"
                              className="form-input" />
                      </div>
                  </div>

                  <button
                      onClick={livroEdicao ? handleEditarLivro : handleCadastrarLivro}
                      className="primary-button"
                  >
                      <i className={livroEdicao ? "fas fa-save" : "fas fa-plus"}></i>
                      {livroEdicao ? 'Salvar Alterações' : 'Cadastrar Livro'}
                  </button>
              </div>

              {/* Seção Autores */}
              <div className="management-section">
                  <h2 className="section-title">
                      <i className="fas fa-user-edit"></i> Gerenciar Autores
                  </h2>

                  <div className="form-group">
                      <input
                          type="text"
                          value={novoAutor}
                          onChange={(e) => setNovoAutor(e.target.value)}
                          placeholder="Nome do autor"
                          className="form-input" />

                      <button
                          onClick={handleCadastrarAutor}
                          className="secondary-button"
                      >
                          <i className="fas fa-plus"></i> Adicionar Autor
                      </button>
                  </div>

                  <div className="list-container">
                      <h3 className="list-title">Autores Cadastrados</h3>
                      <ul className="styled-list">
                          {Object.entries(autores).map(([id, nome]) => (
                              <li key={id} className="list-item">
                                  <span>{nome}</span>
                                  <button
                                      onClick={() => handleExcluirAutor(Number(id))}
                                      className="danger-button"
                                  >
                                      <i className="fas fa-trash"></i>
                                  </button>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

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
                          className="form-input" />
                      <button
                          onClick={handleCadastrarEditora}
                          className="secondary-button"
                      >
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

          {/* Listagem de Livros */}
          <div className="table-section">
              <h2 className="section-title">
                  <i className="fas fa-list"></i> Todos os Livros
              </h2>

              {livros.length === 0 ? (
                  <div className="empty-message">
                      <i className="fas fa-book-dead"></i>
                      <p>Não há livros cadastrados.</p>
                  </div>
              ) : (
                  <div className="table-responsive">
                      <table className="styled-table">
                          <thead>
                              <tr>
                                  <th>Título</th>
                                  <th>Autor</th>
                                  <th>Editora</th>
                                  <th>Ano</th>
                                  <th>Preço</th>
                                  <th>Estoque</th>
                                  <th>Gênero</th>
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
                                      <td>{livro.preco?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                      <td>{livro.estoque}</td>
                                      <td>{livro.genero || '-'}</td>
                                      <td className="actions-cell">
                                          <button
                                              onClick={() => setLivroEdicao(livro)}
                                              className="edit-button"
                                          >
                                              <i className="fas fa-edit"></i> Editar
                                          </button>
                                          <button
                                              onClick={() => handleExcluirLivro(livro.id!)}
                                              className="danger-button"
                                          >
                                              <i className="fas fa-trash"></i> Excluir
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      </div></>
  );
};

export default LivrosPage;