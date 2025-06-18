import "./Header.css";

import { Link } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import LogoSite from "/loog-marvel.jpg";

function Header() {
  return (
    <>
      <header>
        {/* Link do react router dom para a página inicial */}
        {/* o link vai para alguma rota que definimos no app.jsx */}
        <Link to="/">
          <img src={LogoSite} alt="Logo do site" />
        </Link>
      </header>
      <Navbar />
    </>
  );
}

export default Header;
