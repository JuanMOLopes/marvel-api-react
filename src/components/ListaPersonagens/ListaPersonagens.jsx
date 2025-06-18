import React, { useEffect, useState } from "react";
import md5 from "blueimp-md5";

const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";

function ListaPersonagens() {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarPersonagens() {
      setCarregando(true);
      const ts = Date.now().toString();
      const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);
      const url = `https://gateway.marvel.com/v1/public/characters?limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash
=${hash}`;
      const resposta = await fetch(url);
      const dados = await resposta.json();
      setPersonagens(dados.data.results);
      setCarregando(false);
    }
    buscarPersonagens();
  }, []);

  if (carregando) return <p>Carregando heróis...</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {personagens.map((heroi) => (
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
        </div>
      ))}
    </div>
  );
}
export default ListaPersonagens;
