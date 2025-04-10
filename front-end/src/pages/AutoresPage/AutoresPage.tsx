import { useState } from "react";
import {
  useAutores,
  useCreateAutor,
  useDeleteAutor,
} from "../../services/autores";
import Navbar from "../../components/NavBar";
import { AutoresGlobalStyle } from "./styles";

const AutoresPage = () => {
  const [novoAutor, setNovoAutor] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Use React Query hooks
  const {
    data: autoresData = [],
    isLoading,
    isError,
    error: queryError,
  } = useAutores();
  const createAutorMutation = useCreateAutor();
  const deleteAutorMutation = useDeleteAutor();

  const handleCadastrarAutor = async () => {
    if (!novoAutor.trim()) {
      setError("Nome do autor não pode ser vazio");
      return;
    }
    setError(null); // Clear previous errors

    try {
      await createAutorMutation.mutateAsync({ nome: novoAutor });
      setNovoAutor(""); // Clear input on success
    } catch (err) {
      setError("Falha ao cadastrar autor");
      console.error(err);
    }
  };

  const handleExcluirAutor = async (id: number) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este autor? Os livros associados também podem ser afetados."
      )
    ) {
      setError(null); // Clear previous errors
      try {
        await deleteAutorMutation.mutateAsync(id);
      } catch (err) {
        setError(
          "Falha ao excluir autor. Verifique se ele não está associado a livros."
        );
        console.error(err);
      }
    }
  };

  // Combine query error and mutation error states
  const displayError =
    error ||
    (isError
      ? (queryError as Error)?.message || "Falha ao carregar autores"
      : null);

  return (
    <div className="autores-container">
      <AutoresGlobalStyle />
      <Navbar />
      <div className="autores-section">
        <h2 className="section-title">
          <i className="fas fa-user-edit"></i> Gerenciar Autores
        </h2>

        {displayError && <div className="error-message">{displayError}</div>}

        <div className="form-group">
          <input
            type="text"
            value={novoAutor}
            onChange={(e) => setNovoAutor(e.target.value)}
            placeholder="Nome do autor"
            className="form-input"
            disabled={createAutorMutation.isPending}
          />
          <button
            onClick={handleCadastrarAutor}
            className="add-button"
            disabled={createAutorMutation.isPending}
          >
            {createAutorMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Adicionando...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Adicionar Autor
              </>
            )}
          </button>
        </div>

        <div className="list-section">
          <h3 className="list-title">Autores Cadastrados</h3>
          {isLoading ? (
            <p>Carregando autores...</p>
          ) : (
            <ul className="author-list">
              {autoresData.map((autor) => (
                <li key={autor.id} className="author-item">
                  <span>{autor.nome}</span>
                  <button
                    onClick={() => handleExcluirAutor(autor.id!)}
                    className="delete-button"
                    disabled={
                      deleteAutorMutation.isPending &&
                      deleteAutorMutation.variables === autor.id
                    }
                  >
                    {deleteAutorMutation.isPending &&
                    deleteAutorMutation.variables === autor.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && autoresData.length === 0 && (
            <p>Nenhum autor cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoresPage;
