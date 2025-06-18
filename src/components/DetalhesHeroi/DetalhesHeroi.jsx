import './DetalhesHeroi.css'

function DetalhesHeroi({ heroi }) {
  if (!heroi) return null;
  return (
    <>
      <div className="detalhes-container">
        <h1>Detalhes do Herói</h1>
        <h2>{heroi.nome}</h2>
        <img src={heroi.imagem} alt={heroi.nome} className="detalhes-img" />
        <p><strong>Descrição:</strong> {heroi.descricao || "Sem descrição disponível."}</p>
        {heroi.series && heroi.series.length > 0 && (
          <>
            <h4>Séries:</h4>
            <ul>
              {heroi.series.map((serie, index) => (
                <li key={index}>{serie.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default DetalhesHeroi;