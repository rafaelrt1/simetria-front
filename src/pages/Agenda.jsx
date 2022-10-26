import {
    Button,
    Card,
    CardActions,
    CardContent,
    Paper,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";
import { LoginContext } from "../context";

const Agenda = () => {
    const searchContext = useContext(LoginContext);
    const [accessDenied, setAcessDenied] = useState();
    const [reserves, setReserves] = useState([]);

    console.log(reserves);

    const formatDate = (date, optionShowTime) => {
        let formattedDate;
        if (!optionShowTime) {
            formattedDate = `${new Date(date).getDate()}/${(
                new Date(date).getMonth() + 1
            ).toLocaleString("en-US", {
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
        fetch(`http://localhost:5000/reservas`, {
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
                    console.log(result);
                    setReserves(result);
                },
                (error) => {
                    setAcessDenied(true);
                    console.error(error);
                }
            );
    };

    useEffect(() => {
        getUserReserves();
    }, []);

    return (
        <div className="background">
            <Header></Header>
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
                                                sx={{ minWidth: 275 }}
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
                                                        sx={{ fontSize: 18 }}
                                                        gutterBottom
                                                        id={reserve.id}
                                                    >{`Preço: ${parseInt(
                                                        reserve.preco
                                                    ).toLocaleString("pt-br", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}`}</Typography>
                                                    <Typography
                                                        sx={{ fontSize: 18 }}
                                                        gutterBottom
                                                        id={reserve.id}
                                                    >{`Profissonal: ${reserve.profissional}`}</Typography>
                                                    <Typography
                                                        sx={{ fontSize: 18 }}
                                                        gutterBottom
                                                        id={reserve.id}
                                                    >{`Serviço: ${reserve.servico}`}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        variant="contained"
                                                        size="medium"
                                                    >
                                                        Pagar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Paper>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p>Você ainda não tem reservas</p>
                    )}
                </>
            ) : (
                <NotAllowed />
            )}
        </div>
    );
};

export default Agenda;
