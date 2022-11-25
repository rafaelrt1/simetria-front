import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ContextProvider } from "../context";
import Agenda from "../pages/Agenda";
import Agendar from "../pages/Agendar";
import Horarios from "../pages/Horarios";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Login from "../pages/Login";

const Navigation = () => {
    return (
        <BrowserRouter>
            <ContextProvider>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/cadastro" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route exact path="/" element={<Home />} />
                    <Route path="agendar" element={<Agendar />} />
                    <Route path="horarios" element={<Horarios />} />
                    <Route path="minha-agenda" element={<Agenda />} />
                </Routes>
            </ContextProvider>
        </BrowserRouter>
    );
};

export default Navigation;
