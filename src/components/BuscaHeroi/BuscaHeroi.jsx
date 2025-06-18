import { useEffect, useState } from "react";
import md5 from "blueimp-md5";

// chaves da api
const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";

function BuscaHeroi() {
  // estado para armazenar a lista de personagens da api
  const [personagens, setPersonagens] = useState([]);
  // estado para o termo de pesquisa
  const [heroiDigitado, setHeroiDigitado] = useState("");
  // estado se diz se os dados estão sendo carregados
  const [carregando, setCarregando] = useState(true);

  // estado para os favoritados
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem("HeroisFavoritados");
    return salvos ? JSON.parse(salvos) : [];
  });

  // Função para buscar personagens
  const buscarPersonagens = async (nome = "") => {
    setCarregando(true);
    const ts = Date.now().toString();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    let url = `https://gateway.marvel.com/v1/public/characters?limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
    if (nome) {
      url += `&nameStartsWith=${nome}`;
    }

    const resposta = await fetch(url);
    const dados = await resposta.json();
    setPersonagens(dados.data.results);
    setCarregando(false);
  };

  // Busca inicial
  useEffect(() => {
    buscarPersonagens();
  }, []);

  // Salva favoritos no localStorage
  useEffect(() => {
    localStorage.setItem("HeroisFavoritados", JSON.stringify(favoritos));
  }, [favoritos]);

  // Função para alternar favoritos
  const toggleFavorito = (heroi) => {
    setFavoritos((prev) => {
      const jaFavorito = prev.some((f) => f.id === heroi.id);
      if (jaFavorito) {
        return prev.filter((f) => f.id !== heroi.id);
      } else {
        return [...prev, heroi];
      }
    });
  };

  // Exibe mensagem de carregamento
  if (carregando) return <p>Carregando heróis...</p>;

  return (
    <div className="lista-de-personagens">
      <div>
        <input
          type="text"
          placeholder="Pesquisar personagem..."
          value={heroiDigitado}
          onChange={(e) => setHeroiDigitado(e.target.value)}
        />
        <button onClick={() => buscarPersonagens(heroiDigitado)}>Buscar</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {personagens.map((heroi) => (
          <div key={heroi.id}>
            <img
              src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
              alt={heroi.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <h3>{heroi.name}</h3>
            <button onClick={() => toggleFavorito(heroi)}>
              {favoritos.some((f) => f.id === heroi.id)
                ? "Favorito ★"
                : "Favoritar ☆"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuscaHeroi;