import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context";
import {
    PersonOutlineOutlined,
    CalendarMonthOutlined,
    MenuBookOutlined,
    NewspaperOutlined,
} from "@mui/icons-material";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";

const Home = () => {
    const [profile, setProfile] = useState();
    const loginContext = useContext(LoginContext);
    const [accessDenied, setAcessDenied] = useState();
    const history = useNavigate();

    const checkIsLoggedIn = () => {
        try {
            fetch(`http://localhost:5000/permission`, {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: `${loginContext.stateLogin.session}`,
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        if (result.erro) {
                            setAcessDenied(true);
                            localStorage.setItem("userToken", "");
                            localStorage.setItem("userData", "");
                            loginContext.dispatchLogin({
                                isLoggedIn: false,
                                session: null,
                                userData: null,
                            });
                            // history("/login");
                            return;
                        } else {
                            setAcessDenied(false);
                        }
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    return (
        <div className="background">
            <Header></Header>
            {accessDenied === undefined ? null : !accessDenied ? (
                <div className="menuOptions">
                    <div className="menu">
                        <Link to="/agendar">
                            <div className="option">
                                <CalendarMonthOutlined
                                    sx={{ fontSize: "5rem" }}
                                />
                                <p className="optionMenu">Agendar</p>
                            </div>
                        </Link>
                        <div className="option">
                            <MenuBookOutlined sx={{ fontSize: "5rem" }} />
                            <p className="optionMenu">Minha Agenda</p>
                        </div>
                    </div>
                    <div className="menu">
                        <div className="option">
                            <PersonOutlineOutlined sx={{ fontSize: "5rem" }} />
                            <p className="optionMenu">Perfil</p>
                        </div>
                        <div className="option">
                            <NewspaperOutlined sx={{ fontSize: "5rem" }} />
                            <p className="optionMenu">Notícias</p>
                        </div>
                    </div>
                </div>
            ) : (
                <NotAllowed />
            )}
        </div>
    );
};

export default Home;
