import { useContext, useEffect } from "react";

const Horarios = () => {
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
          },
          (error) => {
            console.error(error);
          }
        );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    searchAvailability();
  }, []);

  return <div>Hello</div>;
};

export default Horarios;
