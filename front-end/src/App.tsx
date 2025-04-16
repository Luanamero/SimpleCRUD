// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import Books from './pages/BooksAntigo/Books';
import Clients from './pages/Clients/Clients';
import Orders from './pages/Orders/Orders';
import Report from './pages/Report/Report';
import Login from './pages/Login/Login';
import CustomerProfile from './pages/Cliente/CustomerProfile';
import LivrosPage from './pages/LivrosPage/LivrosPage'; 
import AutoresPage from './pages/AutoresPage/AutoresPage';  
import EditorasPage from './pages/EditorasPage/EditorasPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './services/auth';
import { GlobalStyle } from './style';
const App = () => {
  return (
    <AuthProvider>
      <GlobalStyle />
      <div>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected customer routes */}
          <Route 
            path="/customer/profile" 
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="seller">
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books" 
            element={
              <ProtectedRoute requiredRole="seller">
                <Books />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/livros" 
            element={
              <ProtectedRoute requiredRole="seller">
                <LivrosPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/autores" 
            element={
              <ProtectedRoute requiredRole="seller">
                <AutoresPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editoras" 
            element={
              <ProtectedRoute requiredRole="seller">
                <EditorasPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <ProtectedRoute requiredRole="seller">
                <Clients />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute requiredRole="seller">
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute requiredRole="seller">
                <Report />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy route - redirect to profile page */}
          <Route 
            path="/customer/:id" 
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;

