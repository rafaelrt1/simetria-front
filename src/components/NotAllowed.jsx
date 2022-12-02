import { Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const NotAllowed = (props) => {
    return (
        <div className="container-form-not-allowed">
            <Container maxWidth="xl" sx={{ justifyContent: "center" }}>
                {props.type === "unauthorized" ? (
                    <>
                        <h1 className="not-allowed-label">
                            Não é possível acessar essa página
                        </h1>
                        <div className="not-allowed-options">
                            <Link to="/login" className="not-found-link">
                                <Button
                                    size="medium"
                                    variant="outlined"
                                    sx={{ backgroundColor: "#FFFFFF" }}
                                >
                                    Entre
                                </Button>
                            </Link>
                            <span>ou</span>
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
                    </>
                ) : (
                    <h1 className="not-allowed-label">
                        Ops! Ocorreu um problema. Tente novamente em alguns
                        minutos
                    </h1>
                )}
            </Container>
        </div>
    );
};

export default NotAllowed;
