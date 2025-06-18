import { useEffect, useState } from "react";
import md5 from "blueimp-md5";

// Define as chaves da API Marvel
const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";



// Componente principal que exibe a lista de personagens
function ListaPersonagens() {
  const [personagens, setPersonagens] = useState([]);   // Estado para armazenar os personagens da API
  const [carregando, setCarregando] = useState(true);   // Estado que indica se os dados ainda estão sendo carregados
  const [detalhesPersonagem, setDetalhesPersonagem] = useState(null);   // Estado que armazena os detalhes de um personagem específico (quando clicado)
  const [heroiDigitado, setHeroiDigitado] = useState("");  // Estado para controlar o texto digitado no campo de pesquisa
  const [erro, setErro] = useState("");   // Estado que armazena mensagens de erro



  // Estado que armazena os personagens favoritados, recuperando do localStorage caso existam
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem("HeroisFavoritados"); // Busca os dados salvos
    return salvos ? JSON.parse(salvos) : []; // Converte para objeto ou retorna lista vazia
  });







  //!!!!!!!!!!!!!!!!   BUSCAR PERSONAGEM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // Efeito que executa a busca inicial de personagens ao carregar o componente
  useEffect(() => {
    async function buscarPersonagens() {
      setCarregando(true); // Mostra a tela de carregamento

      const ts = Date.now().toString(); // Gera timestamp atual
      const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA); //Cria o hash exigido pela Marvel combinando: timestamp + chave privada + chave pública





      //!!!!!!!!!!!!!!!! LISTA PERSONAGENS
      // URL da API com limite de 12 personagens
      const url = `https://gateway.marvel.com/v1/public/characters?limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
      const resposta = await fetch(url); // Requisição para API
      const dados = await resposta.json(); // Converte resposta em JSON

      setPersonagens(dados.data.results); // Atualiza o estado com os personagens
      setCarregando(false); // Finaliza o carregamento
    }

    buscarPersonagens(); // Chama a função
  }, []); // Executa apenas uma vez no carregamento do componente

  // Função para buscar personagens com base no nome digitado
  const buscarPorNome = async () => {
    // Verifica se o campo está vazio e exibe erro
    if (heroiDigitado.trim() === "") {
      setErro("Digite o nome de um personagem.");
      setPersonagens([]); // Limpa a lista anterior
      return;
    }

    setErro(""); // Limpa erro anterior
    setCarregando(true); // Inicia carregamento

    const ts = Date.now().toString();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    // Monta a URL com filtro por nome digitado
    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroiDigitado}&limit=12&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    setPersonagens(dados.data.results); // Atualiza a lista com os resultados
    setCarregando(false);
  };

  // Função para buscar detalhes de um personagem específico
  const buscarDetalhes = async (id) => {
    setCarregando(true);

    const ts = Date.now().toString();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    setDetalhesPersonagem(dados.data.results[0]); // Pega o primeiro resultado (único)
    setCarregando(false);
  };

  // Sempre que os favoritos forem atualizados, salva no localStorage
  useEffect(() => {
    localStorage.setItem("HeroisFavoritados", JSON.stringify(favoritos));
  }, [favoritos]); // Dispara toda vez que 'favoritos' muda

  // Função que adiciona ou remove um personagem da lista de favoritos
  const toggleFavorito = (heroi) => {
    setFavoritos((prev) => {
      const jaFavorito = prev.some((f) => f.id === heroi.id); // Verifica se já está na lista
      return jaFavorito
        ? prev.filter((f) => f.id !== heroi.id) // Remove se já for favorito
        : [...prev, heroi]; // Adiciona se ainda não for
    });
  };

  // Exibe mensagem enquanto os dados estão sendo carregados
  if (carregando && !detalhesPersonagem) return <p>Carregando heróis...</p>;

  return (
    <div className="lista-de-personagens">
      {/* Área de pesquisa */}
      <div>
        <input
          type="text"
          placeholder="Pesquisar personagem..."
          value={heroiDigitado} // valor do campo
          onChange={(e) => setHeroiDigitado(e.target.value)} // atualiza o estado
        />
        <button onClick={buscarPorNome}>Buscar</button>
        {/* Exibe erro, se houver */}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      {/* Tela de detalhes do personagem clicado */}
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

      {/* Lista de personagens (quando não está vendo detalhes) */}
      {!detalhesPersonagem && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {personagens.map((heroi) => (
            <div
              key={heroi.id}
              onClick={() => buscarDetalhes(heroi.id)} // Clica no card e vê detalhes
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
                  e.stopPropagation(); // Evita abrir detalhes ao clicar no botão
                  toggleFavorito(heroi); // Alterna o favorito
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

// Exporta o componente principal
export default ListaPersonagens;
