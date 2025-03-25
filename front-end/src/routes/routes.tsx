import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Admin from "../pages/Admin/Admin";
import Books from "../pages/Books/Books";
import Clients from "../pages/Clients/Clients";
import Orders from "../pages/Orders";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/books" element={<Books />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;