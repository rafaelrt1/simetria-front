import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context";

const Horarios = () => {
    const [availability, setAvailability] = useState([]);
    const hostHome = "10.0.0.19";
    const hostBruna = "192.168.0.199";
    const hostIf = "10.40.2.149";
    const searchContext = useContext(LoginContext);

    const searchAvailability = () => {
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let url = `http://${hostHome}:5000/horarios?&servico=${urlParams.get(
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
                    // headers: {
                    //     'Authorization': `Bearer ${token}`
                    // }
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        console.log(result);
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

    const tryReserve = (event) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const time = event.target.textContent;
        const professionalId = event.target.id;
        const date = searchContext.date;

        fetch(`http://${hostHome}:5000/horario`, {
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
                time: time,
                professional: professionalId,
                date: urlParams.get("date"),
                service: urlParams.get("service"),
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setAvailability(result);
                },
                (error) => {
                    console.error(error);
                }
            );
    };

    useEffect(() => {
        searchAvailability();
    }, []);

    return (
        <div className="background">
            {availability?.error ? (
                <div>{availability.error}</div>
            ) : (
                availability.map((employee) => {
                    return (
                        <div key={employee.employee} className="cards-times">
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
                                                    id={employee.employee}
                                                    onClick={(event) =>
                                                        tryReserve(event)
                                                    }
                                                >
                                                    <span
                                                        className="time"
                                                        id={employee.employee}
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
        </div>
    );
};

export default Horarios;
