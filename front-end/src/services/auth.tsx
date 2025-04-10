import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

// Define user types
type UserRole = 'customer' | 'seller' | null;

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  name: string;
  email: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  checkAuth: async () => false,
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth interceptor
  useEffect(() => {
    // Request interceptor for adding token
    const requestInterceptor = api.interceptors.request.use(
      config => {
        if (user?.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        // Always include credentials for cookies
        config.withCredentials = true;
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for handling auth errors
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          // Clear user data on unauthorized
          setUser(null);
          localStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  // Check for existing auth on mount
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        await checkAuth();
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  // Check current auth status with backend
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Call the /me endpoint to verify the current session
      const response = await api.get('/me', { withCredentials: true });
      if (response.data) {
        const userData: AuthUser = {
          id: response.data.id,
          name: response.data.nome,
          email: response.data.email,
          role: 'customer', // Assuming all users from /me are customers
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      // Clear user data if auth check fails
      setUser(null);
      localStorage.removeItem('user');
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Call the backend login endpoint
      const response = await api.post<LoginResponse>('/login', {
        email,
        password
      }, { withCredentials: true });
      
      if (response.data) {
        const userData: AuthUser = {
          id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          role: role,
          token: response.data.access_token
        };
        
        // Store user data
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear user data
      setUser(null);
      localStorage.removeItem('user');
      
      // Optional: call a backend logout endpoint if you have one
      // await api.post('/logout', {}, { withCredentials: true });
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);