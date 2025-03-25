import { useEffect, useState } from 'react';
import { Livro, LivroService } from '../services/livros';
import { AutorService } from '../services/autores';
import { EditoraService } from '../services/editoras';

const LivrosPage = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [autores, setAutores] = useState<Record<number, string>>({});
  const [editoras, setEditoras] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carrega livros, autores e editoras em paralelo
        const [livrosRes, autoresRes, editorasRes] = await Promise.all([
          LivroService.listar(),
          AutorService.listar(),
          EditoraService.listar()
        ]);

        setLivros(livrosRes);
        console.log(livros);
        
        // Cria mapeamento de IDs para nomes
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

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Livros</h1>
      
      {/* Verifica se há livros e exibe uma mensagem caso não haja */}
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
                  <button>Editar</button>
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
