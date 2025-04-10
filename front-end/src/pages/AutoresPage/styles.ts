import { createGlobalStyle } from "styled-components";

export const AutoresGlobalStyle = createGlobalStyle`
.autores-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fff9f3;
  color: #4e342e;
  min-height: 100vh;
  padding: 2rem;
}

.autores-section {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #5d4037;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ef9a9a;
}

.form-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.form-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #a1887f;
  border-radius: 8px;
  background-color: #fffaf5;
  font-size: 1rem;
}

.add-button {
  background-color: #8d6e63;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #6d4c41;
}

.list-section {
  margin-top: 2rem;
}

.list-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #6d4c41;
}

.author-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.author-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fbe9e7;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.delete-button {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #b71c1c;
}

@media (max-width: 600px) {
  .form-group {
    flex-direction: column;
  }

  .form-input, .add-button {
    width: 100%;
  }
}
`;
