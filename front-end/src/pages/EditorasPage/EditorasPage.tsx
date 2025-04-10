import { useState } from "react";
import {
  useEditoras,
  useCreateEditora,
  useDeleteEditora,
} from "../../services/editoras";
import Navbar from "../../components/NavBar";
import { EditorasGlobalStyle } from "./styles";

const EditorasPage = () => {
  const [novaEditora, setNovaEditora] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Use React Query hooks
  const {
    data: editorasData = [],
    isLoading,
    isError,
    error: queryError,
  } = useEditoras();
  const createEditoraMutation = useCreateEditora();
  const deleteEditoraMutation = useDeleteEditora();

  const handleCadastrarEditora = async () => {
    if (!novaEditora.trim()) {
      setError("Nome da editora não pode ser vazio");
      return;
    }
    setError(null); // Clear previous errors

    try {
      await createEditoraMutation.mutateAsync({ nome: novaEditora });
      setNovaEditora(""); // Clear input on success
    } catch (err) {
      setError("Falha ao cadastrar editora");
      console.error(err);
    }
  };

  const handleExcluirEditora = async (id: number) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta editora? Os livros associados também podem ser afetados."
      )
    ) {
      setError(null); // Clear previous errors
      try {
        await deleteEditoraMutation.mutateAsync(id);
      } catch (err) {
        setError(
          "Falha ao excluir editora. Verifique se ela não está associada a livros."
        );
        console.error(err);
      }
    }
  };

  // Combine query error and mutation error states
  const displayError =
    error ||
    (isError
      ? (queryError as Error)?.message || "Falha ao carregar editoras"
      : null);

  return (
    <div className="container">
      <EditorasGlobalStyle />
      <Navbar />
      <div className="management-section">
        <h2 className="section-title">
          <i className="fas fa-building"></i> Gerenciar Editoras
        </h2>

        {displayError && <div className="error">{displayError}</div>}

        <div
          className="form-group"
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <input
            type="text"
            value={novaEditora}
            onChange={(e) => setNovaEditora(e.target.value)}
            placeholder="Nome da editora"
            className="form-input" // Assuming this class exists or adjust as needed
            style={{ flexGrow: 1 }}
            disabled={createEditoraMutation.isPending}
          />
          <button
            onClick={handleCadastrarEditora}
            className="secondary-button" // Assuming this class exists or adjust as needed
            disabled={createEditoraMutation.isPending}
          >
            {createEditoraMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Adicionando...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Adicionar Editora
              </>
            )}
          </button>
        </div>

        <div className="list-container">
          {" "}
          {/* Assuming this class exists or adjust as needed */}
          <h3 className="list-title">Editoras Cadastradas</h3>{" "}
          {/* Assuming this class exists or adjust as needed */}
          {isLoading ? (
            <p>Carregando editoras...</p>
          ) : (
            <ul className="styled-list">
              {" "}
              {/* Assuming this class exists or adjust as needed */}
              {editorasData.map((editora) => (
                <li key={editora.id} className="list-item">
                  {" "}
                  {/* Assuming this class exists or adjust as needed */}
                  <span>{editora.nome}</span>
                  <button
                    onClick={() => handleExcluirEditora(editora.id!)}
                    className="danger-button" // Assuming this class exists or adjust as needed
                    disabled={
                      deleteEditoraMutation.isPending &&
                      deleteEditoraMutation.variables === editora.id
                    }
                  >
                    {deleteEditoraMutation.isPending &&
                    deleteEditoraMutation.variables === editora.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && editorasData.length === 0 && (
            <p>Nenhuma editora cadastrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorasPage;
