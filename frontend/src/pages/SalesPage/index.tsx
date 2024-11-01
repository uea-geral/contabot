import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";

import "./styles.css";

export const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="sales-page">
      <Header />
      <div className="content">
        <button
          className="button primary outline"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button>
        <h1>Vendas</h1>
      </div>
    </main>
  );
};
