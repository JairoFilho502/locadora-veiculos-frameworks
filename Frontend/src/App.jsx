import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState("verificando...");

  useEffect(() => {
    api
      .get("/health")
      .then((resposta) => setStatus(resposta.data.status))
      .catch(() => setStatus("sem conexão com a API"));
  }, []);

  return (
    <div>
      <h1>Locadora de Veículos</h1>
      <p>Status da API: {status}</p>
    </div>
  );
}

export default App;