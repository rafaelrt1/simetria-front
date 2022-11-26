import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer = () => {
    return (
        <footer>
            <div className="">
                <p className="title">Horário de Atendimento</p>
                <p>Ter a Sex: 13:30 - 18:30</p>
                <p>Sab: 08:00 - 17:00</p>
            </div>
            <div className="social">
                <p className="title">Redes sociais:</p>
                <div className="social-links">
                    <a
                        href="https://www.instagram.com/simetria_bybrunabresolin/"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <InstagramIcon
                            sx={{ color: "white" }}
                            fontSize="large"
                        ></InstagramIcon>
                    </a>
                    <a
                        href="https://www.facebook.com/profile.php?id=100049475726524"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <FacebookIcon
                            sx={{ color: "white" }}
                            fontSize="large"
                        ></FacebookIcon>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
