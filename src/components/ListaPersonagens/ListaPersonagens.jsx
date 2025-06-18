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
  return (
    <div className="lista-de-personagens">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {personagens.map((heroi) => (
          <div key={heroi.id}>
            <img
              src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
              alt={heroi.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <h3>{heroi.name}</h3>
            
            {/* Botão de favorito que muda de estilo e texto conforme o estado */}
            <button
              onClick={() => toggleFavorito(heroi)}
              style={{
                marginTop: 8,
                padding: "6px 12px",
                backgroundColor: favoritos.some((f) => f.id === heroi.id)
                  ? "#ffd700"  // Amarelo para favoritado
                  : "#f0f0f0", // Cinza para não favoritado
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {favoritos.some((f) => f.id === heroi.id)
                ? "Favorito ★"  // Texto para favoritado
                : "Favoritar ☆"} // Texto para não favoritado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaPersonagens;