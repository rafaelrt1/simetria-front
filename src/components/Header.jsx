import { PermIdentityOutlined } from "@mui/icons-material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context";
import { GoogleLogout } from "react-google-login";

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
            <PermIdentityOutlined fontSize="large"></PermIdentityOutlined>
            {loginContext.stateLogin.session ? (
                <div>
                    <p>{`Olá, ${
                        loginContext.stateLogin.userData.name.split(" ")[0]
                    }`}</p>
                    <span>Não é você?</span>
                    {loginContext.stateLogin.userData.id ? (
                        <span className="logout" onClick={logout}>
                            Sair
                        </span>
                    ) : loginContext.stateLogin.userData.name ? (
                        <GoogleLogout
                            clientId="384181648681-953cr75doj2h1kkg36ac0keihc3u0vqu.apps.googleusercontent.com"
                            buttonText="Sair"
                            onLogoutSuccess={logout}
                        ></GoogleLogout>
                    ) : null}
                </div>
            ) : (
                <span onClick={() => history("/login")}>Login</span>
            )}
        </div>
    );
};

export default Header;
