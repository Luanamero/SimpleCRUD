import React from "react";

interface FiltroProps {
  nome: string;
  genero: string;
  precoMin: number;
  precoMax: number;
  estoqueBaixo?: boolean; // 👈 torna opcional
  mostrarEstoqueBaixo?: boolean; // 👈 novo prop para controlar visibilidade
  onChange: (filtro: {
    nome: string;
    genero: string;
    precoMin: number;
    precoMax: number;
    estoqueBaixo?: boolean;
  }) => void;
}

const FiltroLivros: React.FC<FiltroProps> = ({
  nome,
  genero,
  precoMin,
  precoMax,
  estoqueBaixo,
  onChange,
  mostrarEstoqueBaixo,
}) => {
  return (
    <div className="filtros-container">
      <div style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>Filtros</div>
      <input
        type="text"
        placeholder="Filtrar por nome"
        value={nome}
        onChange={(e) =>
          onChange({
            nome: e.target.value,
            genero,
            precoMin,
            precoMax,
            estoqueBaixo,
          })
        }
      />

      <input
        type="text"
        placeholder="Filtrar por gênero"
        value={genero}
        onChange={(e) =>
          onChange({
            nome,
            genero: e.target.value,
            precoMin,
            precoMax,
            estoqueBaixo,
          })
        }
      />

      <input
        type="number"
        placeholder="Preço mínimo"
        value={precoMin}
        onChange={(e) =>
          onChange({
            nome,
            genero,
            precoMin: Number(e.target.value),
            precoMax,
            estoqueBaixo,
          })
        }
      />

      <input
        type="number"
        placeholder="Preço máximo"
        value={precoMax}
        onChange={(e) =>
          onChange({
            nome,
            genero,
            precoMin,
            precoMax: Number(e.target.value),
            estoqueBaixo,
          })
        }
      />

      {mostrarEstoqueBaixo && (
        <label>
          <input
            type="checkbox"
            checked={estoqueBaixo ?? false}
            onChange={(e) =>
              onChange({
                nome,
                genero,
                precoMin,
                precoMax,
                estoqueBaixo: e.target.checked,
              })
            }
          />
          Estoque baixo
        </label>
      )}
    </div>
  );
};

export default FiltroLivros;
