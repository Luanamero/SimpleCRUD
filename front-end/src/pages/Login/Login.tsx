import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { ClienteService } from '../../services/clientes';

// Definindo os tipos
type ErrorType = {
    email?: string;
    password?: string;
    general?: string;
};

type UserType = 'customer' | 'seller';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userType, setUserType] = useState<UserType>('customer');
    const [errors, setErrors] = useState<ErrorType>({});

    const validateForm = (): boolean => {
        const newErrors: ErrorType = {};
        
        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        if (userType === 'customer') {
            try {
                const customers = await ClienteService.listar();
                if (!customers?.length) throw new Error('Nenhum cliente encontrado');
                
                const foundCustomer = customers.find(c => c.email === email);
                if (!foundCustomer) {
                  setErrors({ email: 'Email não cadastrado' });
                  return;
                }
              
                if (!foundCustomer.id) {
                  console.error('Cliente sem ID:', foundCustomer);
                  setErrors({ email: 'Erro no perfil do cliente' });
                  return;
                }
              
                console.log('Antes de navegar:', foundCustomer.id);
                navigate(`/customer/${foundCustomer.id}`);
              } catch (error) {
                console.error('Erro ao buscar cliente:', error);
                setErrors({ general: 'Erro ao carregar perfil' });
              }
        } else {
            // lógica para vendedores
            navigate('/admin');
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Acesse sua conta</h1>
                <p className="login-subtitle">Entre com seu email e senha</p>
                
                <div className="user-type-selector">
                    <button 
                        type="button"
                        className={`user-type-btn ${userType === 'customer' ? 'active' : ''}`}
                        onClick={() => setUserType('customer')}
                    >
                        Sou Cliente
                    </button>
                    <button 
                        type="button"
                        className={`user-type-btn ${userType === 'seller' ? 'active' : ''}`}
                        onClick={() => setUserType('seller')}
                    >
                        Sou Vendedor
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    
                    <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Lembrar-me</label>
                        </div>
                        <a href="/forgot-password" className="forgot-password">Esqueceu a senha?</a>
                    </div>
                    
                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;