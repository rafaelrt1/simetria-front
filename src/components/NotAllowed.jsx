import { Container } from "@mui/material";
import { Link } from "react-router-dom";

const NotAllowed = () => {
    return (
        <Container maxWidth="xl">
            <h1>
                Não é possível acessar essa página porque você não está logado
            </h1>
            <Link to="/login">
                <button>Fazer Login</button>
            </Link>
            <p>ou</p>
            <Link to="/register">
                <button>Criar conta</button>
            </Link>
        </Container>
    );
};

export default NotAllowed;
