import React from 'react';
import { Livro } from '../../services/livros';
import './LivroItem.css';

interface LivroItemProps {
  livro: Livro;
}

const LivroItem: React.FC<LivroItemProps> = ({ livro }) => {
  return (
    <div className="livro-item">
      <h3>{livro.titulo}</h3>
      <p><strong>Autor:</strong> {livro.autor_id}</p>
      <p><strong>Categoria:</strong> {livro.genero}</p>
      <p><strong>Preço:</strong>R$ {(Number(livro.preco) || 0).toFixed(2)}</p>
      <p><strong>Estoque:</strong> {livro.estoque} unidades</p>
    </div>
  );
};

export default LivroItem;
