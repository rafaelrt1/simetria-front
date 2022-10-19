import { useForm, Controller } from "react-hook-form";
import { gapi } from "gapi-script";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context";
import CircularProgress from "@mui/material/CircularProgress";
import FeedbackMessage from "../components/FeedbackMessage";

const Login = () => {
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({
        message: "",
        messageType: "",
        visible: false,
    });
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [iconPassword, setIconPassword] = useState("eye");
    const hostHome = "10.0.0.19";
    const hostBruna = "192.168.0.199";
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
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID,
                scope: "email",
            });
        }
        gapi.load("client:auth2", start);
        if (
            loginContext.stateLogin.session &&
            loginContext.stateLogin.isLoggedIn
        ) {
            history("/");
        }
    }, []);

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

    const logout = (response) => {};

    const responseGoogle = (response) => {
        const {
            profileObj: { name, email },
        } = response;

        // localStorage.setItem("userToken", response.tokenId);
        // loginContext.dispatchLogin({
        //     isLoggedIn: true,
        //     session: response.tokenId,
        // });
        // history("/");
    };

    const tryLogin = (data, e) => {
        try {
            // e.preventDefault();
            setVisibleLoader(true);
            // fetch(`http://${hostHome}:5000/login`, {
            fetch(`http://localhost:5000/login`, {
                method: "POST",
                mode: "cors",
                headers: {
                    // headers: {
                    //     'Authorization': `Bearer ${token}`
                    // }
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
                            console.log(result);
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

    console.log(loginContext);

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
                                <p className="errorMessage">
                                    Preencha este campo
                                </p>
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
                                            type="password"
                                            // onBlur={onBlur}
                                            onChange={onChange}
                                            value={value}
                                        ></input>
                                        <label htmlFor="password">Senha</label>
                                        {/* <Icon name='eye' type='FontAwesome' className='fontSize' 20 }} /> */}
                                    </>
                                )}
                                name="password"
                            ></Controller>
                            {errors.password && (
                                <p className="errorMessage">
                                    Preencha este campo
                                </p>
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
                        clientId="384181648681-953cr75doj2h1kkg36ac0keihc3u0vqu.apps.googleusercontent.com"
                        buttonText="Continuar com o Google"
                        onSuccess={responseGoogle}
                        className="secondaryButton"
                        // onFailure={responseGoogle}
                        isSignedIn={true}
                    />
                    {loginContext.isLoggedIn ? (
                        <GoogleLogout
                            clientId="384181648681-953cr75doj2h1kkg36ac0keihc3u0vqu.apps.googleusercontent.com"
                            buttonText="Logout"
                            onLogoutSuccess={logout}
                        ></GoogleLogout>
                    ) : null}

                    <div className="register">
                        <p className="h2">Ainda não tem uma conta?</p>
                        <Link to="/cadastro">
                            <p className="anchor">Cadastre-se</p>
                        </Link>
                    </div>

                    <div className="infos">
                        <p className="title">Horário de Atendimento</p>
                        <p>Ter a Sex: 13:30 - 18:30</p>
                        <p>Sab: 08:00 - 17:00</p>
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
