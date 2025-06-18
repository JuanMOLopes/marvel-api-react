import "./Navbar.css";

import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/favoritos">Favoritos</Link>
    </nav>
  );
}

export default Nav;
