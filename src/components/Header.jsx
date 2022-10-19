import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context";

const Header = () => {
    const history = useNavigate();
    const loginContext = useContext(LoginContext);
    const logout = () => {
        try {
            fetch(`http://localhost:5000/logout`, {
                method: "POST",
                mode: "cors",
                headers: {
                    Authorization: `${loginContext.stateLogin.session}`,
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    token: loginContext.stateLogin.session,
                }),
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        localStorage.setItem("userToken", "");
                        localStorage.setItem("userData", "");
                        loginContext.dispatchLogin({
                            isLoggedIn: false,
                            session: null,
                            userData: null,
                        });
                        history("/login");
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="user">
            <AccountCircle fontSize="large"></AccountCircle>
            {loginContext.stateLogin.session ? (
                <div>
                    <p>{`Olá, ${
                        loginContext.stateLogin.userData.name.split(" ")[0]
                    }`}</p>
                    <span>Não é você?</span>
                    <span className="logout" onClick={logout}>
                        Sair
                    </span>
                </div>
            ) : (
                <Button onClick={() => history("/login")}>Login</Button>
            )}
        </div>
    );
};

export default Header;
