import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

import ListaPersonagens from "../components/ListaPersonagens/ListaPersonagens";
import BuscaHeroi from "../components/BuscaHeroi/BuscaHeroi";

function Home() {
  return (
    <>
      <Header />
      <BuscaHeroi />
      <hr />
      <ListaPersonagens />
      <Footer />
    </>
  );
}

export default Home;
