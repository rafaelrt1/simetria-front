import { Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const NotAllowed = () => {
    return (
        <div className="container-form-not-allowed">
            <Container maxWidth="xl" sx={{ justifyContent: "center" }}>
                <h1 className="not-allowed-label">
                    Não é possível acessar essa página
                </h1>
                <div className="not-alloewd-options">
                    <Link to="/login" className="not-found-link">
                        <Button
                            size="medium"
                            variant="outlined"
                            sx={{ backgroundColor: "#FFFFFF" }}
                        >
                            Entre
                        </Button>
                    </Link>
                    <p>ou</p>
                    <Link to="/cadastro" className="not-found-link">
                        <Button
                            size="medium"
                            variant="outlined"
                            sx={{ backgroundColor: "#FFFFFF" }}
                        >
                            Crie uma conta
                        </Button>
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default NotAllowed;
