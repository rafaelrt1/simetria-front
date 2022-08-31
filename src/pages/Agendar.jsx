import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
  const [professionals, setProfessionals] = useState();
  const [professionalSelected, setProfessionalSelected] = useState("");
  const [professionalsServices, setProfessionalServices] = useState({});

  const isValidDate = () => {
    let date = getValues("date");
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
      if (!professionals_services[service.funcionario]) {
        professionals_services[service.funcionario] = [];
      }
      professionals_services[service.funcionario].push(service);
    });
    setProfessionalServices(professionals_services);
    setProfessionals(Object.keys(professionals_services));
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
          rules={{ required: true, validate: isValidDate }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl sx={{ m: 1, width: "50%" }} variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  dayOfWeekFormatter={(day) => daysOfWeek[day]}
                  inputFormat="dd/MM/yyyy"
                  label="*Selecione o dia"
                  value={value}
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
                label="*Selecione o serviço"
                onChange={onChange}
              >
                {getValues("professional")
                  ? professionalsServices[getValues("professional")].map(
                      (service) => {
                        return (
                          <MenuItem
                            key={service.servico}
                            value={service.servico}
                          >
                            {service.servico}
                          </MenuItem>
                        );
                      }
                    )
                  : services.map((service) => {
                      return (
                        <MenuItem key={service.servico} value={service.servico}>
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
                label="Selecione o profissional"
                onChange={(event) => {
                  let employee = event.target.value;
                  setValue("professional", employee);
                  let service = getValues("service");
                  let professionalDoesService = professionalsServices[
                    employee
                  ].some((servico) => {
                    return servico.servico === service;
                  });
                  if (!professionalDoesService) setValue("service", "");
                }}
              >
                {professionals
                  ? professionals.map((professional) => {
                      return (
                        <MenuItem key={professional} value={professional}>
                          {professional}
                        </MenuItem>
                      );
                    })
                  : null}
              </Select>
            </FormControl>
          )}
          name="professional"
        ></Controller>

        <button disabled={!isDirty} className="mainButton">
          Buscar
        </button>
      </form>
    </div>
  );
};

export default Agendar;
