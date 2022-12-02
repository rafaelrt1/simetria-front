import { useForm, Controller } from "react-hook-form";
import { gapi } from "gapi-script";
import GoogleLogin from "react-google-login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context";
import CircularProgress from "@mui/material/CircularProgress";
import FeedbackMessage from "../components/FeedbackMessage";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const Login = () => {
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({
        message: "",
        messageType: "",
        visible: false,
    });
    const [visiblePassword, setVisiblePassword] = useState(false);
    const loginContext = useContext(LoginContext);
    const history = useNavigate();

    const showFeedbackMessage = (message, type, time) => {
        setFeedbackMessage({
            message: message,
            messageType: type,
            visible: true,
        });
        setTimeout(() => {
            setFeedbackMessage({
                message: "",
                messageType: "",
                visible: false,
            });
        }, time);
    };

    const services = [
        { key: "Escova lisa e modelada" },
        { key: "Corte" },
        { key: "Tratamento capilar" },
        { key: "Botox capilar" },
        { key: "Coloração" },
        { key: "Mechas" },
        { key: "Progressiva" },
        { key: "Design de sobrancelha" },
        { key: "Limpeza de pele" },
        { key: "Manicure e pedicure" },
        { key: "Alongamento em fibra de vidro " },
        { key: "Esmaltação em gel e outros…" },
    ];

    useEffect(() => {
        if (loginContext.stateLogin.session) {
            history("/");
        }
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleGoogleUserAuthenticated = (googleResponse) => {
        try {
            setVisibleLoader(true);
            fetch(`${ENDPOINT}/google-user`, {
                method: "POST",
                mode: "cors",
                headers: {
                    Authorization: googleResponse.tokenId,
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    id: googleResponse.googleId,
                    email: googleResponse.wt.cu,
                    nome: googleResponse.wt.Ad,
                    tokenGoogle: googleResponse.accessToken,
                }),
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        if (result.session) {
                            localStorage.setItem("userToken", result.session);
                            localStorage.setItem(
                                "userData",
                                JSON.stringify(result.userData)
                            );
                            loginContext.dispatchLogin({
                                isLoggedIn: true,
                                session: result.session,
                                userData: result.userData,
                            });
                            setVisibleLoader(false);
                            history("/");
                        } else {
                            setVisibleLoader(false);
                            window.scrollTo(0, 0);
                            showFeedbackMessage(
                                "Erro ao realizar o login",
                                "error",
                                6000
                            );
                        }
                    },
                    (error) => {
                        console.error(error);
                        setVisibleLoader(false);
                        window.scrollTo(0, 0);
                        showFeedbackMessage(
                            "Erro ao realizar o login",
                            "error",
                            6000
                        );
                    }
                );
        } catch (e) {}
    };

    const responseGoogle = (response) => {
        const {
            profileObj: {},
        } = response;
        handleGoogleUserAuthenticated(response);
    };

    const tryLogin = (data, e) => {
        try {
            setVisibleLoader(true);
            fetch(`${ENDPOINT}/login`, {
                method: "POST",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    username: data.email,
                    password: data.password,
                }),
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        if (result.session) {
                            localStorage.setItem("userToken", result.session);
                            localStorage.setItem(
                                "userData",
                                JSON.stringify(result.userData)
                            );
                            loginContext.dispatchLogin({
                                isLoggedIn: true,
                                session: result.session,
                                userData: result.userData,
                            });
                            setVisibleLoader(false);
                            history("/");
                        } else {
                            setVisibleLoader(false);
                            window.scrollTo(0, 0);
                            showFeedbackMessage(
                                "Usuário ou senha incorretos",
                                "error",
                                6000
                            );
                        }
                    },
                    (error) => {
                        console.error(error);
                        setVisibleLoader(false);
                        window.scrollTo(0, 0);
                        showFeedbackMessage(
                            "Usuário ou senha incorretos",
                            "error",
                            6000
                        );
                    }
                );
        } catch (e) {
            console.error(e);
            setVisibleLoader(false);
        }
    };

    return (
        <>
            {loginContext.stateLogin.session ? (
                <></>
            ) : (
                <div className="background">
                    <FeedbackMessage
                        message={feedbackMessage}
                        hideTime={6000}
                    ></FeedbackMessage>
                    <div className="image">
                        <img
                            className="tinyLogo"
                            src={require("../images/Simetria1.png")}
                            alt="Logo Simetria"
                        />
                        <h1 className="simetriaName">Simetria Estética</h1>
                    </div>
                    <form onSubmit={handleSubmit(tryLogin)} className="form">
                        <div className="label-float">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    pattern:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    maxLength: 70,
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <>
                                        <input
                                            placeholder=" "
                                            id="email"
                                            maxLength={70}
                                            type="text"
                                            // onBlur={onBlur}
                                            onChange={onChange}
                                            value={value}
                                        />
                                        <label htmlFor="email">E-mail</label>
                                    </>
                                )}
                                name="email"
                            ></Controller>
                            {errors.email && (
                                <span className="errorMessage">
                                    Preencha este campo
                                </span>
                            )}
                        </div>

                        <div className="label-float">
                            <Controller
                                control={control}
                                rules={{ maxLength: 60, required: true }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <>
                                        <input
                                            placeholder=" "
                                            id="password"
                                            maxLength={60}
                                            type={
                                                visiblePassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={onChange}
                                            value={value}
                                        ></input>
                                        <label htmlFor="password">Senha</label>
                                        {visiblePassword ? (
                                            <VisibilityOffIcon
                                                sx={{
                                                    position: "absolute",
                                                    left: "calc(95% - 12px)",
                                                    top: "25px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    setVisiblePassword(false);
                                                }}
                                            />
                                        ) : (
                                            <VisibilityIcon
                                                sx={{
                                                    position: "absolute",
                                                    left: "calc(95% - 12px)",
                                                    top: "25px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    setVisiblePassword(true);
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                                name="password"
                            ></Controller>
                            {errors.password && (
                                <span className="errorMessage">
                                    Preencha este campo
                                </span>
                            )}
                        </div>
                        {visibleLoader ? <CircularProgress /> : null}
                        <button
                            className="mainButton"
                            onClick={handleSubmit(tryLogin)}
                        >
                            ENTRAR
                        </button>
                    </form>

                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Continuar com o Google"
                        onSuccess={responseGoogle}
                        className="secondaryButton"
                        isSignedIn={true}
                    />

                    <div className="register">
                        <h4>Ainda não tem uma conta?</h4>
                        <Link className="register-link" to="/cadastro">
                            <p className="anchor">Criar conta</p>
                        </Link>
                    </div>

                    <div className="infos">
                        <p className="title">Horário de Atendimento</p>
                        <p>Seg a Sab: 08:30 - 12:00 e 13:30 - 18:30</p>
                        <p className="title">Serviços</p>
                        {services.map(function (item, key) {
                            return (
                                <p key={key} className="service">
                                    {item.key}
                                </p>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
