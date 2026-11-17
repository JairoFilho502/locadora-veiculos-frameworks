import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <h1>Locadora de Veículos</h1>
      <p>Olá, {usuario.nome}!</p>
      <p>Você está logado como {usuario.email}.</p>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default Home;