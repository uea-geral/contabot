import { useNavigate } from "react-router-dom";
import LogoImage from "../../assets/contabot-badge.svg";

import "./styles.css";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="landing">
      <img src={LogoImage} alt="Contabot" />
      <button className="button primary" onClick={() => navigate("/home")}>
        Acessar o sistema
      </button>
    </main>
  );
};
