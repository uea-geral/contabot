import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";

import { useEffect, useState } from "react";
import { api } from "../../api";
import { Product } from "../../entities/product";
import "./styles.css";

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    async function fetch() {
      const { data: newProducts } = await api.get<Product[]>("/products");
      setProducts(newProducts);
    }
    fetch();
  }, []);

  function renderProduct(product: Product) {
    return (
      <li className="product" key={product.id}>
        <label>{product.name}</label>
        <label>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "USD",
          }).format(product.price)}
        </label>
      </li>
    );
  }

  return (
    <main className="products-page">
      <Header />
      <div className="content">
        <button
          className="button primary outline"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button>
        <h1>Produtos</h1>

        {products === undefined && <label>Carregando...</label>}
        {products !== undefined &&
          (products.length == 0 ? (
            <label>Não há produtos cadastrados.</label>
          ) : (
            <ul className="products">{products.map(renderProduct)}</ul>
          ))}
      </div>
    </main>
  );
};
