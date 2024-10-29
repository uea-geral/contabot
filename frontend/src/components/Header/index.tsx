import "./styles.css";

import { useNavigate } from "react-router-dom";
import LogoImage from "../../assets/lcontabot-badge.svg";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <img src={LogoImage} alt="contabot" />
      <button className="button primary outline" onClick={() => navigate("/")}>
        Sair
      </button>
    </header>
  );
};
