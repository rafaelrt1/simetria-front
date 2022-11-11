import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Modal,
    Paper,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";
import { LoginContext } from "../context";
import LoadingButton from "@mui/lab/LoadingButton";
import { display } from "@mui/system";
import FeedbackMessage from "../components/FeedbackMessage";

const Agenda = () => {
    const searchContext = useContext(LoginContext);
    const [accessDenied, setAcessDenied] = useState();
    const [reserves, setReserves] = useState([]);
    const [open, setOpen] = useState(false);
    const [payment, setPayment] = useState();
    const [loading, setLoading] = useState(false);
    const [chosenReserve, setChosenReserve] = useState({});
    const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
    const [feedbackMessage, setFeedbackMessage] = useState({
        message: "",
        messageType: "",
        visible: false,
    });

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

    const handleClose = () => {
        setPayment(undefined);
        setCopyButtonText("Copiar Código");
        setCopyButtonText("Copiar Código");
        setOpen(false);
    };

    const cancelReserve = () => {
        try {
            fetch(`http://${"10.0.0.19"}:8000/reserva`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    Authorization: `${searchContext.stateLogin.session}`,
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({ id: chosenReserve.id }),
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        if (result.erro) {
                            setAcessDenied(true);
                            return;
                        }
                        showFeedbackMessage(
                            "Reserva cancelada",
                            "success",
                            10000
                        );
                        setAcessDenied(false);
                        setReserves(result);
                        setOpen(false);
                    },
                    (error) => {
                        showFeedbackMessage(
                            "Houve um erro ao cancelar a reserva",
                            "error",
                            10000
                        );
                        setAcessDenied(true);
                        console.error(error);
                    }
                );
        } catch (e) {
            showFeedbackMessage(
                "Houve um erro ao cancelar a reserva",
                "error",
                10000
            );
        }
    };

    const formatDate = (date, optionShowTime) => {
        let formattedDate;
        if (!optionShowTime) {
            formattedDate = `${new Date(date)
                .getDate()
                .toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                })}/${(new Date(date).getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
            })}/${new Date(date).getFullYear()}`;
        }

        if (optionShowTime) {
            formattedDate = `${new Date(date)
                .getHours()
                .toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                })}:${new Date(date).getMinutes().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
            })}`;
        }
        return formattedDate;
    };

    const getUserReserves = () => {
        fetch(`http://${"10.0.0.19"}:8000/reservas`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: `${searchContext.stateLogin.session}`,
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    if (result.erro) {
                        setAcessDenied(true);
                        return;
                    }
                    setAcessDenied(false);
                    setReserves(result);
                },
                (error) => {
                    setAcessDenied(true);
                    console.error(error);
                }
            );
    };

    const handlePayment = (event) => {
        const reservationId = event.target.id;

        fetch(`http://${"10.0.0.19"}:8000/qrcode?order=${reservationId}`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: `${searchContext.stateLogin.session}`,
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setLoading(false);
                    if (result.erro) {
                        setAcessDenied(true);
                        return;
                    }
                    setOpen(true);
                    setAcessDenied(false);
                    setPayment(result);
                },
                (error) => {
                    setLoading(false);
                    setAcessDenied(true);
                    console.error(error);
                }
            );
    };

    useEffect(() => {
        getUserReserves();
    }, []);

    return (
        <>
            <Header></Header>
            <div className="background">
                <FeedbackMessage
                    message={feedbackMessage}
                    hideTime={6000}
                ></FeedbackMessage>
                {accessDenied === undefined ? null : !accessDenied ? (
                    <>
                        {reserves?.length ? (
                            <>
                                <h2>Suas reservas:</h2>
                                <div className="card-reserves">
                                    {reserves.map((reserve) => {
                                        return (
                                            <Paper
                                                elevation={3}
                                                key={reserve.id}
                                                id={reserve.id}
                                            >
                                                <Card
                                                    sx={{
                                                        minWidth: 275,
                                                        boxShadow: 0,
                                                    }}
                                                    id={reserve.id}
                                                >
                                                    <CardContent>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 18,
                                                                color: "#000000",
                                                            }}
                                                            gutterBottom
                                                            id={reserve.id}
                                                        >
                                                            {`Data: ${formatDate(
                                                                reserve.dataInicio,
                                                                false
                                                            )} (${formatDate(
                                                                reserve.dataInicio,
                                                                true
                                                            )} - ${formatDate(
                                                                reserve.dataFim,
                                                                true
                                                            )})`}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 18,
                                                            }}
                                                            gutterBottom
                                                            id={reserve.id}
                                                        >{`Preço: ${parseInt(
                                                            reserve.preco
                                                        ).toLocaleString(
                                                            "pt-br",
                                                            {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }
                                                        )}`}</Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 18,
                                                            }}
                                                            gutterBottom
                                                            id={reserve.id}
                                                        >{`Profissonal: ${reserve.profissional}`}</Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 18,
                                                            }}
                                                            gutterBottom
                                                            id={reserve.id}
                                                        >{`Serviço: ${reserve.servico}`}</Typography>
                                                    </CardContent>
                                                    <CardActions
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                        id={reserve.id}
                                                    >
                                                        {reserve.pagavel ? (
                                                            <LoadingButton
                                                                size="medium"
                                                                id={reserve.id.toString()}
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    setChosenReserve(
                                                                        reserve.id
                                                                    );
                                                                    setLoading(
                                                                        true
                                                                    );
                                                                    handlePayment(
                                                                        event
                                                                    );
                                                                }}
                                                                loading={
                                                                    loading &&
                                                                    chosenReserve ===
                                                                        reserve.id
                                                                }
                                                                variant="contained"
                                                            >
                                                                Pagar
                                                            </LoadingButton>
                                                        ) : null}
                                                        <Button
                                                            variant="contained"
                                                            size="medium"
                                                            id={reserve.id.toString()}
                                                            color="error"
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                const selectedReserve =
                                                                    reserves.filter(
                                                                        (
                                                                            reserve
                                                                        ) => {
                                                                            return (
                                                                                reserve.id ===
                                                                                parseInt(
                                                                                    event
                                                                                        .target
                                                                                        .id
                                                                                )
                                                                            );
                                                                        }
                                                                    )[0];
                                                                console.log(
                                                                    selectedReserve
                                                                );
                                                                setChosenReserve(
                                                                    selectedReserve
                                                                );
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Paper>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <h3>Você ainda não tem reservas</h3>
                        )}
                        {chosenReserve ? (
                            <Modal
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"
                            >
                                <Box sx={modal}>
                                    {payment ? (
                                        <>
                                            <Typography
                                                id="keep-mounted-modal-title"
                                                variant="h5"
                                                component="h2"
                                            >
                                                QR code
                                            </Typography>
                                            <Typography id="keep-mounted-modal-title">
                                                Escaneie ou copie o código pelo
                                                aplicativo da sua instituição
                                                financeira para pagar
                                            </Typography>
                                            <img
                                                src={payment.imagemQrcode}
                                            ></img>
                                            <div className="options-modal">
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    color={
                                                        copyButtonText ===
                                                        "Copiado"
                                                            ? "success"
                                                            : "primary"
                                                    }
                                                    onClick={() => {
                                                        setCopyButtonText(
                                                            "Copiado"
                                                        );
                                                        navigator.clipboard.writeText(
                                                            payment.qrcode
                                                        );
                                                    }}
                                                >
                                                    {copyButtonText}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    color="error"
                                                    onClick={handleClose}
                                                >
                                                    Fechar
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Typography
                                                id="keep-mounted-modal-title"
                                                variant="h5"
                                                component="h2"
                                            >
                                                Deseja cancelar o seguinte
                                                agendamento?
                                            </Typography>
                                            <div>
                                                <p>
                                                    {`Data: ${formatDate(
                                                        chosenReserve.dataInicio,
                                                        false
                                                    )} (${formatDate(
                                                        chosenReserve.dataInicio,
                                                        true
                                                    )} - ${formatDate(
                                                        chosenReserve.dataFim,
                                                        true
                                                    )})`}
                                                </p>
                                                <p>
                                                    {`Profissional: ${chosenReserve.profissional}`}
                                                </p>
                                                <p>{`Serviço: ${chosenReserve.servico}`}</p>
                                            </div>
                                            <div className="options-modal">
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    color="success"
                                                    onClick={() => {
                                                        cancelReserve();
                                                    }}
                                                >
                                                    Sim
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    color="error"
                                                    onClick={() => {
                                                        setOpen(false);
                                                    }}
                                                >
                                                    Não
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Box>
                            </Modal>
                        ) : null}
                    </>
                ) : (
                    <NotAllowed />
                )}
            </div>
        </>
    );
};

const modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 200,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

export default Agenda;
