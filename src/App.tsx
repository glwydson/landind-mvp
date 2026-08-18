import { NavLink, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

export function App() {
  return (
    <>
      <header className="topbar">
        <div className="container topbar__inner">
          <NavLink className="logo" to="/">
            Site Forms
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>
              Página Inicial
            </NavLink>
            <NavLink to="/quem-sou">Quem Sou Eu?</NavLink>
          </nav>
          <NavLink className="btn btn--small" to="/quem-sou">
            Saiba mais
          </NavLink>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-sou" element={<About />} />
      </Routes>

      <footer className="footer">
        <div className="container footer__inner">
          <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{" "}
            <a href="https://github.com/glwydson" target="_blank" rel="noopener noreferrer">
              Glwydson
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
