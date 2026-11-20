import { useEffect, useState } from "react";
import Alerta from "../components/Alerta";
import Carregando from "../components/Carregando";
import VeiculoForm from "../components/VeiculoForm";
import VeiculoLista from "../components/VeiculoLista";
import { listarVeiculos } from "../services/veiculoService";
import { mensagemDeErro } from "../utils/formatacao";

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
          setErro(mensagemDeErro(error));
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
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1>Veículos</h1>
        <p>Cadastre novos veículos e consulte a frota por disponibilidade.</p>
      </div>

      <div className="grade">
        <section className="cartao">
          <h2>Cadastrar veículo</h2>
          <VeiculoForm onCadastrado={handleCadastrado} />
        </section>

        <section className="cartao cartao-largo">
          <div className="cartao-cabecalho">
            <h2>Frota</h2>

            <div className="campo campo-inline">
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
          </div>

          {carregando && <Carregando />}
          <Alerta tipo="erro">{erro}</Alerta>
          {!carregando && !erro && <VeiculoLista veiculos={veiculos} />}
        </section>
      </div>
    </div>
  );
}

export default Veiculos;
