import {
  FaShoppingCart as CartIcon,
  FaRobot as RobotIcon,
} from "react-icons/fa";

import { MdOutlinePayment as PaymentIcon } from "react-icons/md";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import "./styles.css";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState<string>();

  function generateReport() {
    setLoadingMessage("Gerando relatório. Aguarde alguns segundos...");
    // setLoadingMessage(undefined);
  }

  return (
    <main className="homepage">
      {loadingMessage && <Loading message={loadingMessage} />}

      <Header />

      <main className="content">
        <h1>Bem-vindo ao Contabot!</h1>
        <label>Módulos</label>
        <div className="modules">
          <button
            className="button primary outline module"
            onClick={() => navigate("/home/products")}
          >
            <CartIcon size={64} />
            Ver Produtos
          </button>
          <button
            className="button primary outline module"
            onClick={() => navigate("/home/sales")}
          >
            <PaymentIcon size={64} />
            Ver Compras
          </button>
          <button
            className="button primary outline module"
            onClick={generateReport}
          >
            <RobotIcon size={64} />
            Gerar relatório
          </button>
        </div>
      </main>
    </main>
  );
};
