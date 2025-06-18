import { useEffect, useState } from "react";
import md5 from "blueimp-md5";

// Chaves da API Marvel
const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";

function ListaPersonagens() {
  // Estados principais
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [detalhesPersonagem, setDetalhesPersonagem] = useState(null);
  const [heroiDigitado, setHeroiDigitado] = useState("");
  const [erro, setErro] = useState("");

  // Estado para os personagens favoritados
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem("HeroisFavoritados");
    return salvos ? JSON.parse(salvos) : [];
  });

  // Busca inicial de personagens ao carregar o componente
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

  // Função para buscar personagem pelo nome digitado
  const buscarPorNome = async () => {
    // Validação: se o campo estiver vazio, exibe mensagem de erro e limpa resultados
    if (heroiDigitado.trim() === "") {
      setErro("Digite o nome de um personagem.");
      setPersonagens([]); // Limpa lista ao erro
      return;
    }

    setErro(""); // Limpa erro anterior
    setCarregando(true);
    const ts = Date.now().toString();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroiDigitado}&limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    setPersonagens(dados.data.results);
    setCarregando(false);
  };

  // Busca detalhes completos de um personagem
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

  // Atualiza os favoritos no localStorage sempre que eles mudarem
  useEffect(() => {
    localStorage.setItem("HeroisFavoritados", JSON.stringify(favoritos));
  }, [favoritos]);

  // Adiciona ou remove um personagem dos favoritos
  const toggleFavorito = (heroi) => {
    setFavoritos((prev) => {
      const jaFavorito = prev.some((f) => f.id === heroi.id);
      return jaFavorito
        ? prev.filter((f) => f.id !== heroi.id)
        : [...prev, heroi];
    });
  };

  // Mostra carregamento enquanto busca dados
  if (carregando && !detalhesPersonagem) return <p>Carregando heróis...</p>;

  return (
    <div className="lista-de-personagens">
      {/* Campo de pesquisa */}
      <div>
        <input
          type="text"
          placeholder="Pesquisar personagem..."
          value={heroiDigitado}
          onChange={(e) => setHeroiDigitado(e.target.value)}
        />
        <button onClick={buscarPorNome}>Buscar</button>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      {/* Exibição de detalhes de um personagem selecionado */}
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

      {/* Lista de personagens (quando não está visualizando detalhes) */}
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
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Impede que clique no botão abra os detalhes
                  toggleFavorito(heroi);
                }}
              >
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
