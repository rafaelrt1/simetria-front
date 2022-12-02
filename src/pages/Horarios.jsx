import { Box, Button, Modal, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackMessage from "../components/FeedbackMessage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";
import { LoginContext } from "../context";
const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const Horarios = () => {
    const [availability, setAvailability] = useState([]);
    const [chosenReserve, setChosenReserve] = useState({});
    const searchContext = useContext(LoginContext);
    const [open, setOpen] = useState(false);
    const [suggestedTime, setSuggestedTime] = useState("");
    const [accessDenied, setAcessDenied] = useState();
    const history = useNavigate();
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

    const handleOpen = async (event) => {
        setSuggestedTime("");
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const date = urlParams.get("date");

        let infos = await fetch(
            `${ENDPOINT}/infos?professional=${
                event.target.id
            }&service=${urlParams.get("service")}&date=${urlParams.get(
                "date"
            )} ${event.target.textContent}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: `${searchContext.stateLogin.session}`,
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.erro === "Usuário deslogado") {
                    setAcessDenied(true);
                    return;
                }
                setAcessDenied(false);
                return result;
            });

        const dateFormatted = `${date.split("-")[2]}/${date.split("-")[1]}/${
            date.split("-")[0]
        }`;

        setChosenReserve({
            professional: infos.professional,
            time: `${event.target.textContent} - ${infos.timeEnd}`,
            dateFormatted: dateFormatted,
            service: infos.service,
            professionalId: event.target.id,
            timeSelected: event.target.textContent,
            serviceId: urlParams.get("service"),
            date: urlParams.get("date"),
        });

        setOpen(true);
    };

    const handleClose = () => setOpen(false);

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
    };

    const searchAvailability = () => {
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let url = `${ENDPOINT}/horarios?&servico=${urlParams.get(
                "service"
            )}&data=${urlParams.get("date")}`;
            // let url = `http://${hostIf}:8000/horarios?&servico=${data.service}&data=${data.date}`;
            if (urlParams.get("professional")) {
                url = url + `&profissional=${urlParams.get("professional")}`;
            }
            fetch(url, {
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
                        if (result.erro === "Usuário deslogado") {
                            setAcessDenied(true);
                            return;
                        }
                        setAcessDenied(false);
                        setAvailability(result);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        } catch (error) {
            console.error(error);
        }
    };

    const tryReserve = () => {
        fetch(`${ENDPOINT}/horario`, {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `${searchContext.stateLogin.session}`,
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
                time: chosenReserve.timeSelected,
                professional: chosenReserve.professionalId,
                date: chosenReserve.date,
                service: chosenReserve.serviceId,
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    if (result.erro === "Usuário deslogado") {
                        setAcessDenied(true);
                        return;
                    }
                    setAcessDenied(false);
                    if (result.status === "success") {
                        showFeedbackMessage(
                            "Reserva efetuada com sucesso",
                            "success",
                            10000
                        );
                        handleClose();
                        searchAvailability();
                        return;
                    }
                    if (result?.nextAvailable?.length) {
                        setSuggestedTime(result.nextAvailable);
                    } else if (!result?.nextAvailable?.length) {
                        setSuggestedTime("Unavailable");
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
    };

    useEffect(() => {
        searchAvailability();
        // eslint-disable-next-line
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
                    <div className="background">
                        {availability?.error ? (
                            <h3>{availability.error}</h3>
                        ) : (
                            availability.map((employee) => {
                                return (
                                    <div
                                        key={employee.employee}
                                        className="cards-times"
                                    >
                                        <div className="professional-times">
                                            {`Profissional: ${employee.employeeName}`}
                                        </div>
                                        <div className="available-times">
                                            <div className="times">
                                                {employee.availableTimes.map(
                                                    (availableTime, index) => {
                                                        return (
                                                            <button
                                                                className="time-card"
                                                                key={index}
                                                                id={
                                                                    employee.employee
                                                                }
                                                                onClick={(
                                                                    event
                                                                ) =>
                                                                    handleOpen(
                                                                        event
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className="time"
                                                                    id={
                                                                        employee.employee
                                                                    }
                                                                >
                                                                    {
                                                                        availableTime
                                                                    }
                                                                </span>
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <Modal
                            keepMounted
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            <Box sx={modal}>
                                {!suggestedTime ? (
                                    <>
                                        <Typography
                                            id="keep-mounted-modal-title"
                                            variant="h5"
                                            component="h2"
                                        >
                                            Confirmar reserva
                                        </Typography>
                                        <Typography
                                            id="keep-mounted-modal-description"
                                            component="h4"
                                            sx={{ mt: 2 }}
                                        >
                                            <p>{`Profissional: ${chosenReserve.professional}`}</p>
                                            <p>{`Data: ${chosenReserve.dateFormatted}`}</p>
                                            <p>{`Serviço: ${chosenReserve.service}`}</p>
                                            <p>{`Horário: ${chosenReserve.time}`}</p>
                                        </Typography>
                                        <div className="options-modal">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={tryReserve}
                                            >
                                                Sim
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={handleClose}
                                            >
                                                Não
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
                                            O horário selecionado não está
                                            disponível
                                        </Typography>
                                        <Typography
                                            id="keep-mounted-modal-title"
                                            variant="h5"
                                            component="h2"
                                        >
                                            {suggestedTime !== "Unavailable" ? (
                                                <>
                                                    <p>
                                                        Deseja agendar às{" "}
                                                        {`${suggestedTime}?`}
                                                    </p>
                                                    <div className="options-modal">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => {
                                                                let newChosenReserve =
                                                                    chosenReserve;
                                                                newChosenReserve.timeSelected =
                                                                    suggestedTime;
                                                                setChosenReserve(
                                                                    newChosenReserve
                                                                );
                                                                tryReserve();
                                                            }}
                                                        >
                                                            Sim
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => {
                                                                handleClose();
                                                                window.location.reload();
                                                            }}
                                                        >
                                                            Não
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p>
                                                        Não há horário
                                                        disponível neste dia
                                                        para o serviço
                                                        escolhido. Faça uma nova
                                                        busca
                                                    </p>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            handleClose();
                                                            history("/agendar");
                                                        }}
                                                    >
                                                        Fechar
                                                    </Button>
                                                </>
                                            )}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Modal>
                    </div>
                ) : (
                    <NotAllowed
                        type={accessDenied ? "unauthorized" : "access-error"}
                    />
                )}
            </div>
            <Footer></Footer>
        </>
    );
};

export default Horarios;
