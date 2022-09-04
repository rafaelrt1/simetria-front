import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

const Agendar = () => {
  const hostHome = "10.0.0.19";
  const hostBruna = "192.168.0.199";
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

  const setOptions = () => {
    console.log("teste");
    if (!idServiceSelected) {
      setCustomerOptionServices([]);
      return;
    }
    // return filteredService[0].options !== [];[];
    let filteredService = services.filter((service) => {
      return service.idServico === idServiceSelected;
    });
    console.log(filteredService[0].options);
    setCustomerOptionServices(filteredService[0].options);
    // return filteredService[0].options !== [];
  };

  const isValidDate = () => {
    let date = getValues("date");
    alert(
      date > new Date().setHours(0, 0, 0) &&
        date.getDay() !== 0 &&
        date.getDay() !== 1
    );
    return (
      date > new Date().setHours(0, 0, 0) &&
      date.getDay() !== 0 &&
      date.getDay() !== 1
    );
  };

  const getInitialDate = () => {
    let today = new Date().getDay();
    if (today !== 0 && today !== 1) return new Date();
    else return new Date(new Date().valueOf() + 1000 * 3600 * 24);
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, isDirty, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      date: getInitialDate(),
      service: "",
      professional: "",
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
    setEmployees(funcionarios);
  };

  const getServices = () => {
    try {
      // fetch(`http://${hostHome}:5000/servicos`, {
      fetch(`http://localhost:5000/servicos`, {
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

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="background">
      <form
        onSubmit={handleSubmit((data) => {
          alert(JSON.stringify(data));
        })}
        className="form"
      >
        <Controller
          control={control}
          rules={{
            required: true,
            validate:
              getValues("date") > new Date().setHours(0, 0, 0) &&
              getValues("date").getDay() !== 0 &&
              getValues("date").getDay() !== 1,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl sx={{ m: 1, width: "50%" }} variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  dayOfWeekFormatter={(day) => daysOfWeek[day]}
                  inputFormat="dd/MM/yyyy"
                  label="*Selecione o dia"
                  value={value}
                  onBlur={onBlur}
                  minDate={new Date()}
                  shouldDisableDate={isNotAvailable}
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          )}
          name="date"
        ></Controller>
        {errors.date && errors.date.type !== "validate" && (
          <p className="errorMessage">Preencha este campo</p>
        )}
        {errors.date && errors.date.type === "validate" && (
          <div className="errorMessage">Selecione uma data válida</div>
        )}

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl sx={{ m: 1, width: "50%" }} variant="outlined">
              <InputLabel id="service">*Selecione o serviço</InputLabel>
              <Select
                labelId="service"
                id="service"
                value={value}
                onBlur={onBlur}
                label="*Selecione o serviço"
                onChange={(event) => {
                  setValue("service", event.target.value);
                  setIdServiceSelected(event.target.value);
                  let filteredService = services.filter((service) => {
                    return service.idServico === event.target.value;
                  });
                  console.log(filteredService[0].options);
                  setCustomerOptionServices(filteredService[0].options);
                }}
              >
                {professionalSelected
                  ? professionalsServices[professionalSelected].map(
                      (service) => {
                        return (
                          <MenuItem
                            name={service.servico}
                            key={service.servico}
                            value={service.idServico}
                          >
                            {service.servico}
                          </MenuItem>
                        );
                      }
                    )
                  : services.map((service) => {
                      return (
                        <MenuItem
                          key={service.idServico}
                          value={service.idServico}
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
        {errors.service && <p className="errorMessage">Preencha este campo</p>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl sx={{ m: 1, width: "50%" }} variant="outlined">
              <InputLabel id="professional">
                Selecione o profissional
              </InputLabel>
              <Select
                labelId="professional"
                id="professional-select"
                value={value}
                onBlur={onBlur}
                label="Selecione o profissional"
                onChange={(event) => {
                  let employee = event.target.value;
                  setValue("professional", employee);
                  setProfessionalSelected(employee);
                  let service = getValues("service");
                  let professionalDoesService = professionalsServices[
                    employee
                  ].some((servico) => {
                    return servico.servico === service;
                  });
                  if (!professionalDoesService) {
                    setValue("service", "");
                    setIdServiceSelected("");
                    // setOptions();
                  }
                }}
              >
                {employees
                  ? employees.map((professional) => {
                      return (
                        <MenuItem
                          key={professional.idProfissional}
                          value={professional.idProfissional}
                        >
                          {professional.nome}
                        </MenuItem>
                      );
                    })
                  : null}
              </Select>
            </FormControl>
          )}
          name="professional"
        ></Controller>

        {services && services[0] && idServiceSelected
          ? customerOptionServices.map((option, index) => {
              console.log(option);
              return (
                <div key={index}>
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
                      control={<Radio />}
                      label="Vou usar do local"
                    />
                    <FormControlLabel
                      value="home"
                      control={<Radio />}
                      label="Vou levar de casa"
                    />
                  </RadioGroup>
                </div>
              );
            })
          : null}

        <button className="mainButton">Buscar</button>
      </form>
    </div>
  );
};

export default Agendar;
