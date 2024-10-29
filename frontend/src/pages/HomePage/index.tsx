import {
  FaShoppingCart as CartIcon,
  FaRobot as RobotIcon,
} from "react-icons/fa";

import { MdOutlinePayment as PaymentIcon } from "react-icons/md";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import "./styles.css";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState<string>();

  async function generateReport() {
    setLoadingMessage("Gerando relatório. Aguarde alguns segundos...");
    const { data } = await api.get("/sales/report?page=0&offset=1000", {
      responseType: "blob",
    });
    setLoadingMessage(undefined);
    const href = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "report-sales-contabot.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
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
