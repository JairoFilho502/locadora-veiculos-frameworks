import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="topo">
        <div className="topo-conteudo">
          <NavLink to="/" className="marca">
            Locadora
          </NavLink>

          <nav className="menu">
            <NavLink to="/" end>
              Início
            </NavLink>
            <NavLink to="/veiculos">Veículos</NavLink>
            <NavLink to="/locacoes">Locações</NavLink>
          </nav>

          <div className="usuario">
            <span className="usuario-nome">{usuario.nome}</span>
            <button
              type="button"
              className="botao botao-secundario"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
