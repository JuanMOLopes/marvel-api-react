import React, { useState, useEffect } from 'react';
import md5 from 'blueimp-md5';
import './BuscaHeroi.css';

function BuscaHeroi() {
  const [heroiDigitado, setHeroiDigitado] = useState("");
  const [heroiEncontrado, setHeroiEncontrado] = useState(null);
  const [erro, setErro] = useState("");
  const [heroiSalvo, setHeroiSalvo] = useState(
    () => JSON.parse(localStorage.getItem("informacoesHeroi")) || []
  );
  const [favoritar, setFavoritar] = useState(false);

  const CHAVE_PUBLICA = "5f71ad45f8bf04ba8b3e36c159fe7134";
  const CHAVE_PRIVADA = "99a4adea344cbba3374ce5c2f66bf756e840ad3d";

  async function fetchHeroi(e) {
    e.preventDefault();

    if (heroiDigitado.trim() === "") {
      setErro("Digite o nome de um personagem.");
      setHeroiEncontrado(null);
      return;
    }

    const ts = Date.now();
    const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

    try {
      const resposta = await fetch(
        `https://gateway.marvel.com/v1/public/characters?name=${heroiDigitado}&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`
      );
      const dados = await resposta.json();

      if (dados.data.results.length === 0) {
        throw new Error("Personagem não encontrado.");
      }

      setHeroiEncontrado(dados.data.results[0]);
      setErro("");
    } catch (erro) {
      setErro(erro.message);
      setHeroiEncontrado(null);
    }
  }

  useEffect(() => {
    if (favoritar && heroiEncontrado) {
      const novoHeroi = {
        id: heroiEncontrado.id,
        nome: heroiEncontrado.name,
        imagem: `${heroiEncontrado.thumbnail.path}.${heroiEncontrado.thumbnail.extension}`,
        descricao: heroiEncontrado.description,
        series: heroiEncontrado.series.items,
      };

      const heroisAtualizados = [...heroiSalvo, novoHeroi];

      localStorage.setItem("informacoesHeroi", JSON.stringify(heroisAtualizados));
      setHeroiSalvo(heroisAtualizados);
      setFavoritar(false); // Resetar o estado para não salvar duplicado
    }
  }, [favoritar]);

  return (
    <>
      <h1>MarvelDex</h1>

      <form onSubmit={fetchHeroi}>
        <input
          type="text"
          placeholder="Digite o nome do herói"
          value={heroiDigitado}
          onChange={(e) => setHeroiDigitado(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}

      {heroiEncontrado && (
        <div style={{ marginTop: "20px" }}>
          <h2>{heroiEncontrado.name}</h2>
          <img
            src={`${heroiEncontrado.thumbnail.path}.${heroiEncontrado.thumbnail.extension}`}
            alt={heroiEncontrado.name}
            width="200"
          />
          <p>{heroiEncontrado.description || "Sem descrição disponível."}</p>

          {heroiEncontrado.series.items.length > 0 && (
            <>
              <h4>Séries:</h4>
              <ul>
                {heroiEncontrado.series.items.map((serie, index) => (
                  <li key={index}>{serie.name}</li>
                ))}
              </ul>
            </>
          )}

          <button onClick={() => setFavoritar(true)}>Favoritar</button>
        </div>
      )}
    </>
  );
}

export default BuscaHeroi;