import { useEffect, useState } from "react";
import md5 from "blueimp-md5";

// chaves da api
const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";

function ListaPersonagens() {
  // estado para armazenar a lista de personagens da api
  const [personagens, setPersonagens] = useState([]);
  
  // estado se diz se os dados estão sendo carregados
  const [carregando, setCarregando] = useState(true);
  
  // estado para os favoritados
  const [favoritos, setFavoritos] = useState(() => {
    // primeiro tentamos pegar a lista salva no local storage
    const salvos = localStorage.getItem("HeroisFavoritados");
    // se a lista existir, retorna ela, senão retorna uma lista vazia
    return salvos ? JSON.parse(salvos) : [];
  });

  // Efeito para buscar os personagens quando o componente é montado (quando a pagina carrega pela primeira vez ou é recarregada)
  useEffect(() => {
    async function buscarPersonagens() {
      setCarregando(true);
      const ts = Date.now().toString();
      const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);
      
      // Chamada à API
      const url = `https://gateway.marvel.com/v1/public/characters?limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
      const resposta = await fetch(url);
      const dados = await resposta.json();
      
      // Atualiza o estado com os resultados
      setPersonagens(dados.data.results);
      setCarregando(false);
    }
    buscarPersonagens();
  }, []);

  // Efeito para salvar os favoritos no localStorage sempre que mudam
  useEffect(() => {
    localStorage.setItem("HeroisFavoritados", JSON.stringify(favoritos));
  }, [favoritos]);

  // Função para alternar entre favoritar/desfavoritar
  const toggleFavorito = (heroi) => {
    setFavoritos((prev) => {
      // Verifica se o herói já está favoritado
      const jaFavorito = prev.some((f) => f.id === heroi.id);
      
      // Se já estiver, remove da lista. Se não, adiciona.
      if (jaFavorito) {
        return prev.filter((f) => f.id !== heroi.id);
      } else {
        return [...prev, heroi];
      }
    });
  };

  // Exibe mensagem de carregamento enquanto os dados não chegam
  if (carregando) return <p>Carregando heróis...</p>;

  // Renderização da lista de personagens
  // ...existing code...
// ...existing code...
return (
  <div
    className="lista-de-personagens"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "80vh",
      padding: "48px 0", // Espaço acima e abaixo
      boxSizing: "border-box",
      width: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "center",
        maxWidth: 1200,
        width: "100%",
      }}
    >
      {personagens.map((heroi) => (
        <div
          key={heroi.id}
          style={{
            border: "3px solid #e62429",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 16,
            background: "transparent",
            width: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "box-shadow 0.2s",
          }}
        >
          <img
            src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
            alt={heroi.name}
            style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
          />
          <h3 style={{ margin: "8px 0 0 0", fontSize: 18, textAlign: "center" }}>{heroi.name}</h3>
          <button
            onClick={() => toggleFavorito(heroi)}
            style={{
              marginTop: 12,
              padding: "6px 16px",
              backgroundColor: favoritos.some((f) => f.id === heroi.id)
                ? "#ffd700"
                : "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 15,
              transition: "background 0.2s",
            }}
          >
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

export default ListaPersonagens;