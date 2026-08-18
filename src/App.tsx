import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="topbar">
        <div className="container topbar__inner">
          <NavLink className="logo" to="/" onClick={() => setMenuOpen(false)}>
            Site Forms
          </NavLink>

          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
          </button>

          <nav
            id="site-nav"
            className={`nav${menuOpen ? " nav--open" : ""}`}
            aria-label="Principal"
          >
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Página Inicial
            </NavLink>
            <NavLink to="/quem-sou" onClick={() => setMenuOpen(false)}>
              Quem Sou Eu?
            </NavLink>
            <NavLink
              className="btn btn--small nav__cta"
              to="/quem-sou"
              onClick={() => setMenuOpen(false)}
            >
              Saiba mais
            </NavLink>
          </nav>

          <NavLink className="btn btn--small topbar__cta" to="/quem-sou">
            Saiba mais
          </NavLink>
        </div>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

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
