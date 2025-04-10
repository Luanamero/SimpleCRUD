import { createGlobalStyle } from "styled-components";

export const LoginGlobalStyles = createGlobalStyle`
.login-container {
  background-color: #f9f5f0; /* Bege claro como fundo */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.login-box {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(93, 64, 55, 0.1);
  border: 1px solid #d7ccc8; /* Borda marrom claro */
  text-align: center;
}

.login-title {
  font-size: 2.2rem;
  color: #5d4037; /* Marrom escuro */
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #8d6e63; /* Marrom médio */
  margin-bottom: 2.5rem;
}

.user-type-selector {
  display: flex;
  margin-bottom: 2rem;
  border-radius: 10px;
  overflow: hidden;
  background: #f5ebe0; /* Bege mais quente */
  border: 1px solid #d7ccc8;
}

.user-type-btn {
  flex: 1;
  padding: 0.8rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #8d6e63; /* Marrom médio */
  transition: all 0.3s ease;
}

.user-type-btn.active {
  background: #8d6e63; /* Marrom médio */
  color: white;
}

.user-type-btn:hover:not(.active) {
  background: #f5ebe0;
  color: #5d4037; /* Marrom escuro */
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #5d4037; /* Marrom escuro */
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #d7ccc8; /* Marrom claro */
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s ease;
  background-color: #f9f5f0; /* Fundo bege claro */
}

.form-group input:focus {
  outline: none;
  border-color: #8d6e63; /* Marrom médio */
  background-color: white;
}

.form-group input.error {
  border-color: #d32f2f; /* Vermelho para erros */
}

.error-message {
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-options label {
  white-space: nowrap;
}

.remember-me {
  display: flex;
  align-items: center;
  color: #5d4037; /* Marrom escuro */
}

.remember-me input {
  margin-right: 0.5rem;
  accent-color: #8d6e63; /* Marrom médio para checkbox */
}

.forgot-password {
  color: #8d6e63; /* Marrom médio */
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5d4037; /* Marrom escuro */
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #8d6e63; /* Marrom médio */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 8px rgba(141, 110, 99, 0.2);
}

.login-button:hover {
  background-color: #6d4c41; /* Marrom mais escuro */
}

.login-footer {
  margin-top: 2rem;
  color: #8d6e63; /* Marrom médio */
}

.login-footer a {
  color: #8d6e63; /* Marrom médio */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #5d4037; /* Marrom escuro */
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-box {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.8rem;
  }

  .user-type-selector {
    flex-direction: column;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .forgot-password {
    margin-left: 0;
  }
}
`;
