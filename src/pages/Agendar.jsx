import { useContext, useEffect, useState } from "react";
import { useForm, Controller, useController } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
    Button,
    createTheme,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Popover,
    Radio,
    RadioGroup,
    Select,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { LoginContext } from "../context";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NotAllowed from "../components/NotAllowed";
import Footer from "../components/Footer";
const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const Agendar = () => {
    const searchContext = useContext(LoginContext);
    const history = useNavigate();
    const hostHome = "10.0.0.19";
    const hostBruna = "192.168.0.199";
    const hostIf = "10.40.2.149";
    const daysOfWeek = {
        Su: "D",
        Mo: "S",
        Tu: "T",
        We: "Q",
        Th: "Q",
        Fr: "S",
        Sa: "S",
    };

    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [professionalSelected, setProfessionalSelected] = useState("");
    const [idServiceSelected, setIdServiceSelected] = useState();
    const [professionalsServices, setProfessionalServices] = useState({});
    const [customerOptionServices, setCustomerOptionServices] = useState([]);
    const [serviceSelected, setServiceSelected] = useState({});
    const [nameProfessionalSelected, setNameProfessionalSelected] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [options, setOptions] = useState([]);
    const [accessDenied, setAcessDenied] = useState();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const isValidDate = () => {
        let date = getValues("date");
        return (
            date >= new Date().setHours(0, 0, 0, 0) &&
            date.getDay() !== 0 &&
            date.getDay() !== 1
        );
    };

    const getInitialDate = () => {
        let today = new Date().getDay();
        if (today !== 0 && today !== 1) return new Date();
        else if (today === 0) {
            return new Date(new Date().valueOf() + 1000 * 3600 * 48);
        } else if (today === 1) {
            return new Date(new Date().valueOf() + 1000 * 3600 * 24);
        }
    };

    const {
        control,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        getValues,
        formState: { isValid, isDirty, errors },
    } = useForm({
        defaultValues: {
            date: getInitialDate(),
            service: "",
        },
    });

    const isNotAvailable = (date) => {
        return date.getDay() === 1 || date.getDay() === 0;
    };

    const separateServicesProfessional = (services) => {
        let professionals_services = {};
        services.forEach((service) => {
            if (!professionals_services[service.idFuncionario]) {
                professionals_services[service.idFuncionario] = [];
            }
            professionals_services[service.idFuncionario].push(service);
        });
        setProfessionalServices(professionals_services);
        let funcionarios = [];
        Object.values(professionals_services).forEach((service, index) => {
            let idProfissional = Object.keys(professionals_services)[index];
            funcionarios.push({
                nome: service[0].funcionario,
                idProfissional: idProfissional,
            });
        });
        funcionarios.push({ nome: "Todos", idProfissional: 0 });
        setEmployees(funcionarios);
    };

    const getServices = () => {
        try {
            fetch(`${ENDPOINT}/servicos`, {
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
                        setServices(result);
                        separateServicesProfessional(result);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        } catch (e) {
            console.error(e);
        }
    };

    const searchAvailability = (data) => {
        let formattedDate = `${data.date.getUTCFullYear()}-${(
            data.date.getMonth() + 1
        ).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
        })}-${data.date.getDate().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
        })}`;
        searchContext.dispatchSearch({
            service: data.service,
            date: formattedDate,
            professional: data.professional,
        });
        localStorage.setItem(
            "search",
            JSON.stringify({
                service: data.service,
                date: formattedDate,
                professional: data.professional,
            })
        );
        window.open(
            `/horarios?service=${
                data.service
            }&date=${formattedDate}&professional=${
                data.professional ? data.professional : ""
            }`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    useEffect(() => {
        getServices();
    }, []);

    return (
        <>
            <Header></Header>
            <div className="background">
                {accessDenied === undefined ? null : !accessDenied ? (
                    <form
                        onSubmit={handleSubmit((data) => {
                            searchAvailability(data);
                        })}
                        className="form"
                    >
                        <h2 className="h2">Agendar</h2>
                        <div className="container-form">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    validate: isValidDate,
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemeProvider theme={theme}>
                                        <FormControl
                                            error={errors.date ? true : false}
                                            sx={{
                                                m: 1,
                                                width: "100%",
                                                backgroundColor: "#FFFFFF",
                                                borderRadius: "5px",
                                            }}
                                            variant="outlined"
                                        >
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}
                                            >
                                                <ThemeProvider
                                                    theme={themeDefalut}
                                                >
                                                    <DatePicker
                                                        dayOfWeekFormatter={(
                                                            day
                                                        ) => daysOfWeek[day]}
                                                        inputFormat="dd/MM/yyyy"
                                                        label="*Data"
                                                        value={value}
                                                        onBlur={onBlur}
                                                        theme={theme}
                                                        minDate={new Date().setHours(
                                                            0,
                                                            0,
                                                            0,
                                                            0
                                                        )}
                                                        shouldDisableDate={
                                                            isNotAvailable
                                                        }
                                                        onChange={onChange}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <ThemeProvider
                                                                theme={theme}
                                                            >
                                                                <TextField
                                                                    {...params}
                                                                    error={
                                                                        errors.date
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                            </ThemeProvider>
                                                        )}
                                                    />
                                                </ThemeProvider>
                                            </LocalizationProvider>
                                        </FormControl>
                                    </ThemeProvider>
                                )}
                                name="date"
                            ></Controller>
                            {errors.date?.type === "required" && (
                                <span className="errorMessage">
                                    Selecione uma data
                                </span>
                            )}
                            {errors.date?.type === "validate" && (
                                <span className="errorMessage">
                                    Selecione uma data válida
                                </span>
                            )}

                            {/* <Controller> */}
                            {/* control={control}
            render={({ field: { onChange, onBlur, value } }) => ( */}
                            <FormControl
                                sx={{
                                    m: 1,
                                    width: "100%",
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: "5px",
                                }}
                                variant="outlined"
                            >
                                <InputLabel
                                    sx={{ fontSize: "1.3rem" }}
                                    id="professional"
                                >
                                    Profissional
                                </InputLabel>
                                <Select
                                    labelId="professional"
                                    id="professional-select"
                                    value={professionalSelected}
                                    // onBlur={onBlur}
                                    label="Profissional"
                                    sx={{ fontSize: "1.3rem" }}
                                    onChange={(event) => {
                                        let employee = event.target.value;
                                        setValue("professional", employee);
                                        if (!employee) {
                                            setValue("professional", 0);
                                            setProfessionalSelected(0);
                                            return;
                                        }
                                        setProfessionalSelected(employee);
                                        let employeeName = employees.filter(
                                            (e) => {
                                                return (
                                                    e.idProfissional ===
                                                    event.target.value
                                                );
                                            }
                                        );
                                        setNameProfessionalSelected(
                                            employeeName[0].nome
                                        );
                                        let service = getValues("service");
                                        if (service) {
                                            let professionalDoesService =
                                                professionalsServices[
                                                    employee
                                                ].some((servico) => {
                                                    return (
                                                        servico.idServico ===
                                                        service
                                                    );
                                                });
                                            if (!professionalDoesService) {
                                                setValue("service", "");
                                                setError("service", {
                                                    type: "required",
                                                });
                                                setIdServiceSelected("");
                                            }
                                        }
                                    }}
                                >
                                    {employees
                                        ? employees.map(
                                              (professional, index) => {
                                                  return (
                                                      <MenuItem
                                                          sx={{
                                                              fontSize:
                                                                  "1.3rem",
                                                          }}
                                                          key={index}
                                                          value={
                                                              professional.idProfissional
                                                          }
                                                      >
                                                          {professional.nome}
                                                      </MenuItem>
                                                  );
                                              }
                                          )
                                        : null}
                                </Select>
                            </FormControl>
                            {/* )} */}
                            {/* name="professional" > */}
                            {/* </Controller> */}

                            <Controller
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value } }) => (
                                    <FormControl
                                        error={errors.service ? true : false}
                                        sx={{
                                            m: 1,
                                            width: "100%",
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "5px",
                                            fontSize: "1.3rem",
                                        }}
                                        variant="outlined"
                                    >
                                        <InputLabel
                                            sx={{ fontSize: "1.3rem" }}
                                            id="service"
                                        >
                                            *Serviço
                                        </InputLabel>
                                        <Select
                                            labelId="service"
                                            id="service"
                                            value={value}
                                            label="*Serviço"
                                            sx={{ fontSize: "1.3rem" }}
                                            onChange={(event) => {
                                                let filteredService =
                                                    services.filter(
                                                        (service) => {
                                                            return (
                                                                service.idServico ===
                                                                event.target
                                                                    .value
                                                            );
                                                        }
                                                    );
                                                setValue(
                                                    "service",
                                                    event.target.value
                                                );
                                                if (
                                                    filteredService[0]?.servico
                                                ) {
                                                    clearErrors("service");
                                                }
                                                setIdServiceSelected(
                                                    event.target.value
                                                );
                                                setServiceSelected(
                                                    filteredService[0]
                                                );
                                                setCustomerOptionServices(
                                                    filteredService[0].options
                                                );
                                                let options = [];
                                                filteredService[0].options.forEach(
                                                    (option) => {
                                                        options.push({
                                                            value: "establishment",
                                                            id: option,
                                                        });
                                                    }
                                                );
                                                setOptions(options);
                                            }}
                                        >
                                            {professionalSelected &&
                                            professionalSelected !== 0
                                                ? professionalsServices[
                                                      professionalSelected
                                                  ].map((service) => {
                                                      return (
                                                          <MenuItem
                                                              sx={{
                                                                  fontSize:
                                                                      "1.3rem",
                                                              }}
                                                              key={
                                                                  service.servico
                                                              }
                                                              value={
                                                                  service.idServico
                                                              }
                                                          >
                                                              {service.servico}
                                                          </MenuItem>
                                                      );
                                                  })
                                                : services.map((service) => {
                                                      return (
                                                          <MenuItem
                                                              sx={{
                                                                  fontSize:
                                                                      "1.3rem",
                                                              }}
                                                              key={
                                                                  service.idServico
                                                              }
                                                              value={
                                                                  service.idServico
                                                              }
                                                          >
                                                              {service.servico}
                                                          </MenuItem>
                                                      );
                                                  })}
                                        </Select>
                                    </FormControl>
                                )}
                                name="service"
                            ></Controller>
                            {errors.service?.type === "required" ? (
                                <span className="errorMessage">
                                    Selecione o serviço
                                </span>
                            ) : null}

                            {services && services[0] && idServiceSelected
                                ? customerOptionServices.map(
                                      (option, index) => {
                                          return (
                                              <div
                                                  className="customer-choice-radio"
                                                  key={index}
                                                  id={index.toString()}
                                              >
                                                  <FormLabel id="demo-radio-buttons-group-label">
                                                      {option}
                                                  </FormLabel>
                                                  <RadioGroup
                                                      aria-labelledby="demo-radio-buttons-group-label"
                                                      defaultValue="establishment"
                                                      name="radio-buttons-group"
                                                  >
                                                      <FormControlLabel
                                                          value="establishment"
                                                          control={
                                                              <Radio
                                                                  onChange={() => {
                                                                      let optionsAvailable =
                                                                          options;
                                                                      optionsAvailable[
                                                                          index
                                                                      ].value =
                                                                          "establishment";
                                                                      setOptions(
                                                                          optionsAvailable
                                                                      );
                                                                  }}
                                                                  value="establishment"
                                                              />
                                                          }
                                                          label="Vou usar do local"
                                                      />
                                                      <FormControlLabel
                                                          value="home"
                                                          control={
                                                              <Radio
                                                                  onChange={() => {
                                                                      let optionsAvailable =
                                                                          options;
                                                                      optionsAvailable[
                                                                          index
                                                                      ].value =
                                                                          "home";
                                                                      setOptions(
                                                                          optionsAvailable
                                                                      );
                                                                  }}
                                                                  value="home"
                                                              />
                                                          }
                                                          label="Vou levar de casa"
                                                      />
                                                  </RadioGroup>
                                              </div>
                                          );
                                      }
                                  )
                                : null}
                            {idServiceSelected && getValues("date") ? (
                                <div className="service-summary">
                                    <div className="summary-prices">
                                        <h3>{serviceSelected.servico}</h3>
                                        <h3> - </h3>
                                        <h3>
                                            {serviceSelected.precoMinimo.toLocaleString(
                                                "pt-br",
                                                {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }
                                            )}
                                        </h3>
                                        {serviceSelected.precoMaximo ? (
                                            <Typography sx={{ p: 2 }}>
                                                O preço pode variar de{" "}
                                                {serviceSelected.precoMinimo.toLocaleString(
                                                    "pt-br",
                                                    {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }
                                                )}{" "}
                                                a{" "}
                                                {serviceSelected.precoMaximo.toLocaleString(
                                                    "pt-br",
                                                    {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }
                                                )}
                                            </Typography>
                                        ) : null}
                                    </div>
                                    <div className="summary-prices">
                                        <h4>Tempo: </h4>
                                        <h4>
                                            {serviceSelected.duracaoMinima.split(
                                                ":"
                                            )[0] !== "00"
                                                ? serviceSelected.duracaoMinima.split(
                                                      ":"
                                                  )[0] + "h"
                                                : null}
                                            {serviceSelected.duracaoMinima.split(
                                                ":"
                                            )[1] !== "00"
                                                ? +serviceSelected.duracaoMinima.split(
                                                      ":"
                                                  )[1] + "min"
                                                : null}
                                        </h4>
                                        {serviceSelected.duracaoMaxima ? (
                                            <h4>
                                                {serviceSelected.duracaoMaxima.split(
                                                    ":"
                                                )[0] !== "00"
                                                    ? serviceSelected.duracaoMaxima.split(
                                                          ":"
                                                      )[0] + "h"
                                                    : null}
                                                {serviceSelected.duracaoMaxima.split(
                                                    ":"
                                                )[1] !== "00"
                                                    ? +serviceSelected.duracaoMaxima.split(
                                                          ":"
                                                      )[1] + "min"
                                                    : null}
                                            </h4>
                                        ) : null}
                                    </div>
                                    {serviceSelected.complemento ? (
                                        <p>{serviceSelected.complemento}</p>
                                    ) : null}
                                    {professionalSelected ? (
                                        <h4>
                                            Profissional:{" "}
                                            {nameProfessionalSelected}
                                        </h4>
                                    ) : null}
                                    {serviceSelected.instrucoes ? (
                                        <p>
                                            Instruções:{" "}
                                            {serviceSelected.instrucoes}
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}
                            <button
                                disabled={
                                    getValues("date") &&
                                    getValues("service") &&
                                    Object.keys(errors).length === 0
                                        ? false
                                        : true
                                }
                                className="mainButton"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>
                ) : (
                    <NotAllowed />
                )}
            </div>
            <Footer></Footer>
        </>
    );
};

const theme = createTheme({
    typography: {
        htmlFontSize: 13,
    },
});

const themeDefalut = createTheme({
    typography: {},
});

export default Agendar;
