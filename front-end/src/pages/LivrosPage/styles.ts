import { createGlobalStyle } from "styled-components";

export const LivrosGlobalStyle = createGlobalStyle`
    .container {
    max-width: 960px;
    margin: 3rem auto;
    padding: 2rem;
    font-family: 'Georgia', serif;
    background-color: #fffaf5;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(102, 51, 0, 0.1);
    }

    h2 {
    text-align: center;
    color: #4e342e;
    margin-bottom: 2rem;
    font-size: 2rem;
    }

    ul {
    list-style: none;
    padding: 0;
    margin-bottom: 2.5rem;
    }

    li {
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
    background-color: #f8f1eb;
    border-left: 5px solid #8d6e63;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }

    input[type="text"],
    select {
    padding: 0.75rem;
    margin: 0.5rem 0;
    width: 100%;
    border: 1px solid #bcaaa4;
    border-radius: 6px;
    font-size: 1rem;
    background-color: #fffaf5;
    color: #4e342e;
    }

    button {
    background-color: #6d4c41;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    margin-top: 1rem;
    margin-right: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
    font-size: 1rem;
    }

    button:hover {
    background-color: #5d4037;
    }

    .error,
    .erro {
    color: #b71c1c;
    margin-top: 1rem;
    font-weight: bold;
    }

    .management-section {
    background-color: #fdf7f2;
    border: 1px solid #d7ccc8;
    padding: 2rem;
    border-radius: 10px;
    margin-top: 3rem;
    }

    .section-title {
    margin-top: 2rem;
    color: #4e342e;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    }

    .label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-weight: 500;
    color: #5d4037;
    }

    .form-group {
    margin-bottom: 1.5rem;
    }

    .form-input,
    .form-select {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #a1887f;
    border-radius: 6px;
    background-color: #fffaf5;
    color: #4e342e;
    }

    .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    }

    .lista-livros {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    }

    .lista-livros li {
    background-color: #f8f1eb;
    border-left: 5px solid #8d6e63;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4e342e;
    font-size: 1rem;
    flex-wrap: wrap;
    }

    .lista-livros li span {
    flex: 1 1 auto;
    margin-right: 1rem;
    }

    .botoes-livro {
    display: flex;
    gap: 0.5rem;
    }

    .botoes-livro button {
    background-color: #6d4c41;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
    }

    .botoes-livro button:hover {
    background-color: #5d4037;
    }


    @media (max-width: 768px) {
    .form-row {
        flex-direction: column;
    }
    }


    .filtros-container {
    width: 250px;
    padding: 12px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.9rem;
    }

    .filtros-container h4 {
    margin-bottom: 8px;
    font-size: 1rem;
    }

    .filtros-container input[type="text"],
    .filtros-container input[type="number"] {
    width: 100%;
    padding: 4px 6px;
    margin-bottom: 8px;
    font-size: 0.85rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    }

    .filtros-container label {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    margin-top: 4px;
    }

    .filtros-container input[type="checkbox"] {
    margin-right: 6px;
    transform: scale(0.9);
    }
`;
