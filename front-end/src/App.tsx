// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import Books from './pages/Books/Books';
import Clients from './pages/Clients/Clients';
import Orders from './pages/Orders/Orders';
import Report from './pages/Report/Report';
import Login from './pages/Login/Login';
import { ClienteService } from './services/clientes';
import CustomerProfile from './pages/Cliente/CustomerProfile';
import LivrosPage from './pages/LivrosPage/LivrosPage'; 
import AutoresPage from './pages/AutoresPage/AutoresPage';  
import EditorasPage from './pages/EditorasPage/EditorasPage'; 
// Dentro do seu componente de rotas
<Route path="/login" element={<Login />} />

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/books" element={<Books />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={<CustomerProfile />} />
        <Route path="/livros" element={<LivrosPage />} />
        <Route path="/autores" element={<AutoresPage />} />
        <Route path="/editoras" element={<EditorasPage />} />
        <Route path="/customer/:id" element={<CustomerProfile />} />
      </Routes>
    </div>
  );
};

export default App;

