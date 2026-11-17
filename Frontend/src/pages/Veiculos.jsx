import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VeiculoForm from "../components/VeiculoForm";
import VeiculoLista from "../components/VeiculoLista";
import { listarVeiculos } from "../services/veiculoService";

const filtros = {
  todos: undefined,
  disponiveis: true,
  indisponiveis: false,
};

function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [atualizacao, setAtualizacao] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    listarVeiculos(filtros[filtro])
      .then((dados) => {
        if (ativo) {
          setVeiculos(dados);
          setErro("");
        }
      })
      .catch((error) => {
        if (ativo) {
          setErro(
            error.response?.data?.error || "Não foi possível conectar à API"
          );
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [filtro, atualizacao]);

  function handleCadastrado() {
    setAtualizacao((valor) => valor + 1);
  }

  return (
    <div>
      <h1>Veículos</h1>

      <p>
        <Link to="/">Voltar para o início</Link>
      </p>

      <h2>Cadastrar veículo</h2>
      <VeiculoForm onCadastrado={handleCadastrado} />

      <h2>Frota</h2>

      <div>
        <label htmlFor="filtro">Mostrar</label>
        <select
          id="filtro"
          value={filtro}
          onChange={(evento) => setFiltro(evento.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="disponiveis">Disponíveis</option>
          <option value="indisponiveis">Indisponíveis</option>
        </select>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p>{erro}</p>}
      {!carregando && !erro && <VeiculoLista veiculos={veiculos} />}
    </div>
  );
}

export default Veiculos;