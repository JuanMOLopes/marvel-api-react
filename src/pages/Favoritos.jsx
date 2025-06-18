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

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Header />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          justifyContent: "center",
          padding: 32,
        }}
      >
        {favoritos.length === 0 ? (
          <p style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
            Nenhum herói favoritado ainda.
          </p>
        ) : (
          favoritos.map((heroi) => (
            <div
              key={heroi.id}
              style={{
                border: "3px solid #ff0000",
                background: "rgba(255,255,255,0.05)",
                padding: 20,
                width: 200,
                textAlign: "center",
                borderRadius: 8,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: 0,
              }}
            >
              <img
                src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
                alt={heroi.name}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  marginBottom: 12,
                  background: "#222",
                }}
              />
              <h3 style={{ color: "#fff", margin: "8px 0 12px 0" }}>{heroi.name}</h3>
              <button
                onClick={() => removerFavorito(heroi.id)}
                style={{
                  marginTop: "auto",
                  padding: "8px 16px",
                  backgroundColor: "#ff2222",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  transition: "background 0.2s",
                }}
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Favoritos;