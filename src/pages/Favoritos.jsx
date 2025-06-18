import { useState, useEffect } from "react";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const salvos = localStorage.getItem("HeroisFavoritados");
    if (salvos) {
      setFavoritos(JSON.parse(salvos));
    }
  }, []);

  const removerFavorito = (id) => {
    setFavoritos((prev) => {
      const novosFavoritos = prev.filter((f) => f.id !== id);
      localStorage.setItem("HeroisFavoritados", JSON.stringify(novosFavoritos));
      return novosFavoritos;
    });
  };

  if (favoritos.length === 0) {
    return <p>Nenhum herói favoritado ainda.</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {favoritos.map((heroi) => (
          <div
            key={heroi.id}
            style={{
              border: "1px solid #eee",
              padding: 16,
              width: 180,
              textAlign: "center",
            }}
          >
            <img
              src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
              alt={heroi.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <h3>{heroi.name}</h3>
            <button
              onClick={() => removerFavorito(heroi.id)}
              style={{
                marginTop: 8,
                padding: "6px 12px",
                backgroundColor: "#ff4500",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favoritos;