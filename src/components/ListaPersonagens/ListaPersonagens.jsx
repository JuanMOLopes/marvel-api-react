import { useEffect, useState } from "react";
import md5 from "blueimp-md5";

// chaves da api
const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";

function ListaPersonagens() {
  // estados principais
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [detalhesPersonagem, setDetalhesPersonagem] = useState(null);
  const [heroiDigitado, setHeroiDigitado] = useState("");

  // estado para os favoritos
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem("HeroisFavoritados");
    return salvos ? JSON.parse(salvos) : [];
  });

  // busca inicial de personagens
  useEffect(() => {
    async function buscarPersonagens() {
      setCarregando(true);
      const ts = Date.now().toString();
      const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

      const url = `https://gateway.marvel.com/v1/public/characters?limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      setPersonagens(dados.data.results);
      setCarregando(false);
    }
    buscarPersonagens();
  }, []);

  // busca por nome
  const buscarPorNome = async () => {
    if (!heroiDigitado) return;
    
    setCarregando(true);
    const ts = Date.now().toString();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroiDigitado}&limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    setPersonagens(dados.data.results);
    setCarregando(false);
  };

  // busca detalhes do personagem
  const buscarDetalhes = async (id) => {
    setCarregando(true);
    const ts = Date.now().toString();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    setDetalhesPersonagem(dados.data.results[0]);
    setCarregando(false);
  };

  // favoritos
  useEffect(() => {
    localStorage.setItem("HeroisFavoritados", JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (heroi) => {
    setFavoritos((prev) => {
      const jaFavorito = prev.some((f) => f.id === heroi.id);
      return jaFavorito 
        ? prev.filter((f) => f.id !== heroi.id) 
        : [...prev, heroi];
    });
  };

  if (carregando && !detalhesPersonagem) return <p>Carregando heróis...</p>;

  return (
    <div className="lista-de-personagens">
      {/* Barra de pesquisa */}
      <div>
        <input
          type="text"
          placeholder="Pesquisar personagem..."
          value={heroiDigitado}
          onChange={(e) => setHeroiDigitado(e.target.value)}
        />
        <button onClick={buscarPorNome}>Buscar</button>
      </div>

      {/* Tela de detalhes */}
      {detalhesPersonagem && (
        <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc" }}>
          <button onClick={() => setDetalhesPersonagem(null)}>Voltar</button>
          <h2>{detalhesPersonagem.name}</h2>
          <img
            src={`${detalhesPersonagem.thumbnail.path}/portrait_uncanny.${detalhesPersonagem.thumbnail.extension}`}
            alt={detalhesPersonagem.name}
            style={{ width: "300px", borderRadius: 8 }}
          />
          <p>{detalhesPersonagem.description || "Sem descrição disponível"}</p>
          <button onClick={() => toggleFavorito(detalhesPersonagem)}>
            {favoritos.some((f) => f.id === detalhesPersonagem.id)
              ? "Remover dos Favoritos"
              : "Adicionar aos Favoritos"}
          </button>
        </div>
      )}

      {/* Lista de personagens (só mostra se não estiver vendo detalhes) */}
      {!detalhesPersonagem && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {personagens.map((heroi) => (
            <div 
              key={heroi.id} 
              onClick={() => buscarDetalhes(heroi.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
                alt={heroi.name}
                style={{ width: "100%", borderRadius: 8 }}
              />
              <h3>{heroi.name}</h3>
              <button onClick={(e) => {
                e.stopPropagation();
                toggleFavorito(heroi);
              }}>
                {favoritos.some((f) => f.id === heroi.id)
                  ? "Favorito ★"
                  : "Favoritar ☆"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaPersonagens;
