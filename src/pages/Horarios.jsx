import { RestartAlt } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";
import { LoginContext } from "../context";

const Horarios = () => {
    const [availability, setAvailability] = useState([]);
    const [chosenReserve, setChosenReserve] = useState({});
    const hostHome = "10.0.0.19";
    const hostBruna = "192.168.0.199";
    const hostIf = "10.40.2.149";
    const searchContext = useContext(LoginContext);
    const [open, setOpen] = useState(false);
    const [suggestedTime, setSuggestedTime] = useState("");
    const [accessDenied, setAcessDenied] = useState();
    const history = useNavigate();

    const getInfosFromSelectedReserve = async (
        professionalSelected,
        serviceSelected,
        timeSelected
    ) => {
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            await fetch(
                `http://localhost:5000/infos?professional=${professionalSelected}&service=${serviceSelected}&date=${urlParams.get(
                    "date"
                )} ${timeSelected}`,
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
                    if (result.erro) {
                        setAcessDenied(true);
                        return;
                    }
                    setAcessDenied(false);
                    return result;
                });
        } catch (e) {}
    };

    const handleOpen = async (event) => {
        setSuggestedTime("");
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const date = urlParams.get("date");

        let infos = await fetch(
            `http://localhost:5000/infos?professional=${
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
                if (result.erro) {
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
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const searchAvailability = () => {
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let url = `http://localhost:5000/horarios?&servico=${urlParams.get(
                "service"
            )}&data=${urlParams.get("date")}`;
            // let url = `http://${hostIf}:5000/horarios?&servico=${data.service}&data=${data.date}`;
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
                        /* TODO: Remover mock */
                        // if (!result?.length) {
                        //     result = [
                        //         {
                        //             availableTimes: ["20:00"],
                        //             employee: 1,
                        //             employeeName: "Bruna",
                        //         },
                        //     ];
                        // } else {
                        //     result[0].availableTimes.push("20:00");
                        // }
                        if (result.erro) {
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
        // fetch(`http://${hostHome}:5000/horario`, {
        fetch(`http://localhost:5000/horario`, {
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
                    if (result.erro) {
                        setAcessDenied(true);
                        return;
                    }
                    setAcessDenied(false);
                    if (result.status === "success") {
                        return;
                    }
                    if (result?.nextAvailable?.length) {
                        setSuggestedTime(result.nextAvailable);
                    } else if (!result?.nextAvailable?.length) {
                        setSuggestedTime("Unavailable");
                    }
                },
                (error) => {
                    setAcessDenied(true);
                    console.error(error);
                }
            );
    };

    useEffect(() => {
        searchAvailability();
    }, []);

    return (
        <div className="background">
            <Header></Header>
            {accessDenied === undefined ? null : !accessDenied ? (
                <div className="background">
                    {availability?.error ? (
                        <div>{availability.error}</div>
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
                                                            onClick={(event) =>
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
                                                                {availableTime}
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
                                            </>
                                        ) : (
                                            <>
                                                <p>
                                                    Não há horário disponível
                                                    neste dia para o serviço
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
                <NotAllowed />
            )}
        </div>
    );
};

export default Horarios;
