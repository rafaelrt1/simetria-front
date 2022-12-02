import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import FeedbackMessage from "../components/FeedbackMessage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const Register = () => {
    const history = useNavigate();
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({
        message: "",
        messageType: "",
        visible: false,
    });
    const [visiblePassword, setVisiblePassword] = useState(false);

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

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullname: "",
            email: "",
            cellphone: "",
            password: "",
        },
    });

    const onSubmit = (data) => {
        registerUser(data);
    };

    const registerUser = (data, e) => {
        try {
            setVisibleLoader(true);

            fetch(`${ENDPOINT}/register`, {
                method: "POST",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    cell: data.cellphone
                        .replaceAll("(", "")
                        .replaceAll(")", "")
                        .replaceAll(" ", "")
                        .replaceAll("-", ""),
                    pass: data.password,
                    email: data.email,
                    name: data.fullname,
                }),
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        setVisibleLoader(false);
                        if (result.error) {
                            if (
                                result.error ===
                                "Já existe uma conta cadastrada com este e-mail"
                            ) {
                                showFeedbackMessage(
                                    result.error,
                                    "error",
                                    10000
                                );
                            } else {
                                showFeedbackMessage(
                                    "Ocorreu um erro ao tentar cadastrar o usuário",
                                    "error",
                                    10000
                                );
                            }
                        } else {
                            showFeedbackMessage(
                                "Cadastro efetuado com sucesso. Você será redirecionado para fazer login com sua nova conta",
                                "success",
                                10000
                            );
                            setTimeout(() => {
                                history("/login");
                            }, 7000);
                        }
                    },
                    (error) => {
                        console.error(error);
                        setVisibleLoader(false);
                    }
                );
        } catch (e) {
            console.error(e);
            setVisibleLoader(false);
        }
    };

    return (
        <>
            <Header></Header>
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
                    <p className="simetriaName">Simetria Estética</p>
                </div>
                <form onSubmit={handleSubmit(registerUser)} class="form">
                    <div className="label-float">
                        <Controller
                            control={control}
                            rules={{ maxLength: 60, required: true }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <>
                                    <input
                                        id="name"
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        placeholder=" "
                                    />
                                    <label htmlFor="name">Nome completo</label>
                                </>
                            )}
                            name="fullname"
                        ></Controller>
                        {errors.fullname && (
                            <span className="errorMessage">
                                Preencha este campo
                            </span>
                        )}
                    </div>

                    <div className="label-float">
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 70,
                                required: true,
                                pattern:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <>
                                    <input
                                        id="email"
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        placeholder=" "
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
                            rules={{
                                required: true,
                                minLength: 15,
                                maxLength: 15,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <>
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        value={value}
                                        placeholder=" "
                                        onChange={onChange}
                                    ></InputMask>
                                    <label htmlFor="cell">Celular</label>
                                </>
                            )}
                            name="cellphone"
                        ></Controller>
                        {errors.cellphone && (
                            <span className="errorMessage">
                                Preencha este campo
                            </span>
                        )}
                    </div>

                    <div className="label-float">
                        <Controller
                            control={control}
                            rules={{ maxLength: 30, required: true }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <>
                                    <input
                                        id="password"
                                        type={
                                            visiblePassword
                                                ? "text"
                                                : "password"
                                        }
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        placeholder=" "
                                    />
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

                    <button
                        className="mainButton"
                        onClick={handleSubmit(onSubmit)}
                    >
                        CADASTRAR
                    </button>
                </form>

                {visibleLoader ? <CircularProgress /> : null}
            </div>
            <Footer></Footer>
        </>
    );
};

export default Register;
