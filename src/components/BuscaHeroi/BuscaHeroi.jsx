import React, { useState, useEffect } from 'react';
import md5 from 'blueimp-md5';
import './BuscaHeroi.css';

// Define o componente funcional BuscaHeroi
function BuscaHeroi() {
 
  const [heroiDigitado, setHeroiDigitado] = useState(""); // Estado que armazena o texto digitado no campo de busca
  const [heroiEncontrado, setHeroiEncontrado] = useState(null);   // Estado que guarda o herói retornado pela API (ou null se nenhum)
  const [erro, setErro] = useState("");  // Estado que guarda mensagens de erro 
  const [heroiSalvo, setHeroiSalvo] = useState(  // Estado que carrega os heróis salvos no localStorage ao iniciar o componente
    () => JSON.parse(localStorage.getItem("informacoesHeroi")) || []   // JSON.parse transforma a string do localStorage em objeto/array
  );
  // Estado para salvar o herói nos favoritos
  const [favoritar, setFavoritar] = useState(false);



  // Chaves para autenticar na API
  const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
  const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";



  // Função chamada ao submeter o formulário de busca
  async function fetchHeroi(e) {      // 'e' é o objeto de evento de envio do formulário
    e.preventDefault();             // preventDefault() impede que o formulario recarregue



    // Se o campo estiver vazio, exibe mensagem de erro
    if (heroiDigitado.trim() === "") {
      setErro("Digite o nome de um personagem.");
      // Limpa dados anteriores de herói
      setHeroiEncontrado(null);
      return;
    }

    // Gera timestamp atual
    const ts = Date.now();
    // Cria o hash exigido pela Marvel combinando: timestamp + chave privada + chave pública
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    try {
      // Faz a requisição para a API da Marvel com os parâmetros exigidos
      const resposta = await fetch( // aguardar buscar
        `https://gateway.marvel.com/v1/public/characters?name=${heroiDigitado}&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`
      );
      //heroiDigitado: texto digitado no campo de busca

      const dados = await resposta.json(); // Converte a resposta para JSON


      // Se a lista de resultados estiver vazia, significa que o herói não foi encontrado
      if (dados.data.results.length === 0) {
        throw new Error("Personagem não encontrado.");
      }

      // Atualiza o estado com os dados do primeiro herói encontrado
      setHeroiEncontrado(dados.data.results[0]);
      // Limpa mensagem de erro, se houver
      setErro("");
    } catch (erro) {
      // Exibe a mensagem de erro 
      setErro(erro.message);

      // Limpa dados antigos de herói, se existirem
      setHeroiEncontrado(null);
    }
  }

  // useEffect executa um efeito colateral quando 'favoritar' mudar
  useEffect(() => {
    // Se for solicitado para favoritar e há um herói encontrado, cria um objeto com as informações do herói
    if (favoritar && heroiEncontrado) {
      const novoHeroi = {
        nome: heroiEncontrado.name,
        imagem: `${heroiEncontrado.thumbnail.path}.${heroiEncontrado.thumbnail.extension}`,
    
      };


      // Adiciona esse novo herói à lista atual de salvos
      const heroisAtualizados = [...heroiSalvo, novoHeroi];
      // Salva a nova lista no localStorage (convertida para string com JSON.stringify)
      localStorage.setItem("informacoesHeroi", JSON.stringify(heroisAtualizados));
      // Atualiza o estado local com a nova lista
      setHeroiSalvo(heroisAtualizados);
      // Reseta o estado para evitar salvar duplicado
      setFavoritar(false);
    }
     }, [favoritar]); // Executa sempre que 'favoritar' mudar
      // Retorno do componente JSX que será renderizado na tela
  
  
  
  return (
    <>
      <h1>MarvelDex</h1>

      {/* Formulário de busca */}
      <form onSubmit={fetchHeroi}>    
        <input
          type="text"
          placeholder="Digite o nome do herói"
          value={heroiDigitado} // Valor ligado ao estado
          onChange={(e) => setHeroiDigitado(e.target.value)} // Atualiza o estado conforme digitação
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Exibe mensagem de erro, se houver */}
      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}

      {/* Se um herói foi encontrado, exibe as informações */}
      {heroiEncontrado && (
        <div style={{ marginTop: "20px" }}>
          <h2>{heroiEncontrado.name}</h2>

          {/* Exibe imagem do herói */}
          <img
            src={`${heroiEncontrado.thumbnail.path}.${heroiEncontrado.thumbnail.extension}`}
            alt={heroiEncontrado.name}
            width="200"
          />

        </div>
      )}
    </>
  );
}


export default BuscaHeroi;
