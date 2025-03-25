// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import Books from './pages/Books/Books';
import Clients from './pages/Clients/Clients';
import Orders from './pages/Orders';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/books" element={<Books />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default App;

