import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context";
import {
  PersonOutlineOutlined,
  CalendarMonthOutlined,
  MenuBookOutlined,
  NewspaperOutlined,
} from "@mui/icons-material";

const Home = () => {
  const [profile, setProfile] = useState();
  const loginContext = useContext(LoginContext);

  useEffect(() => {}, []);

  return (
    <div className="background">
      <div className="menuOptions">
        <div className="menu">
          <Link to="/agendar">
            <div className="option">
              <CalendarMonthOutlined sx={{ fontSize: "5rem" }} />
              <p className="optionMenu">Agendar</p>
            </div>
          </Link>
          <div className="option">
            <MenuBookOutlined sx={{ fontSize: "5rem" }} />
            <p className="optionMenu">Minha Agenda</p>
          </div>
        </div>
        <div className="menu">
          <div className="option">
            <PersonOutlineOutlined sx={{ fontSize: "5rem" }} />
            <p className="optionMenu">Perfil</p>
          </div>
          <div className="option">
            <NewspaperOutlined sx={{ fontSize: "5rem" }} />
            <p className="optionMenu">Notícias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
