import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginGlobalStyles } from "./styles";
import { useAuth } from "../../services/auth";

// Definindo os tipos
type ErrorType = {
  email?: string;
  password?: string;
  general?: string;
};

type UserType = "customer" | "seller";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ErrorType = {};

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password, userType);
      
      if (success) {
        // Redirect based on user type
        if (userType === "customer") {
          navigate("/customer/profile");
        } else {
          navigate("/admin");
        }
      } else {
        setErrors({ general: "Email ou senha incorretos" });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrors({ general: "Erro ao fazer login. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <LoginGlobalStyles />
      <div className="login-box">
        <h1 className="login-title">Acesse sua conta</h1>
        <p className="login-subtitle">Entre com seu email e senha</p>

        <div className="user-type-selector">
          <button
            type="button"
            className={`user-type-btn ${
              userType === "customer" ? "active" : ""
            }`}
            onClick={() => setUserType("customer")}
            disabled={isLoading}
          >
            Sou Cliente
          </button>
          <button
            type="button"
            className={`user-type-btn ${userType === "seller" ? "active" : ""}`}
            onClick={() => setUserType("seller")}
            disabled={isLoading}
          >
            Sou Vendedor
          </button>
        </div>

        {errors.general && (
          <div className="error-message general-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className={errors.password ? "error" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
