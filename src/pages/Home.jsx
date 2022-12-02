import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context";
import {
    CalendarMonthOutlined,
    MenuBookOutlined,
    NewspaperOutlined,
} from "@mui/icons-material";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";
import Footer from "../components/Footer";
const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const Home = () => {
    const loginContext = useContext(LoginContext);
    const [accessDenied, setAcessDenied] = useState();
    const pages = [
        {
            pages: [
                { name: "Agendar", route: "/agendar" },
                { name: "Minha agenda", route: "/minha-agenda" },
            ],
        },
    ];

    const checkIsLoggedIn = () => {
        try {
            fetch(`${ENDPOINT}/permission`, {
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
                        if (result.erro === "Usuário deslogado") {
                            setAcessDenied(true);
                            localStorage.setItem("userToken", "");
                            localStorage.setItem("userData", "");
                            loginContext.dispatchLogin({
                                isLoggedIn: false,
                                session: null,
                                userData: null,
                            });
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
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header></Header>
            <div className="background">
                <div className="container-form">
                    {accessDenied === undefined ? null : !accessDenied ? (
                        <div className="menuOptions">
                            {pages.map((row, index) => {
                                return (
                                    <div className="menu" key={index}>
                                        {row.pages.map((page, index) => {
                                            return (
                                                <Link
                                                    to={page.route}
                                                    key={index}
                                                    className="home-link"
                                                >
                                                    <div className="option">
                                                        {page.name ===
                                                        "Agendar" ? (
                                                            <CalendarMonthOutlined
                                                                sx={{
                                                                    fontSize:
                                                                        "5rem",
                                                                }}
                                                            />
                                                        ) : page.name ===
                                                          "Minha agenda" ? (
                                                            <MenuBookOutlined
                                                                sx={{
                                                                    fontSize:
                                                                        "5rem",
                                                                }}
                                                            />
                                                        ) : (
                                                            <NewspaperOutlined
                                                                sx={{
                                                                    fontSize:
                                                                        "5rem",
                                                                }}
                                                            />
                                                        )}
                                                        <p className="optionMenu">
                                                            {page.name}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <NotAllowed
                            type={
                                accessDenied ? "unauthorized" : "access-error"
                            }
                        />
                    )}
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Home;
