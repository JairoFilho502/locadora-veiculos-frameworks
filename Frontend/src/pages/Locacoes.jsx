import { useEffect, useState } from "react";
import Alerta from "../components/Alerta";
import Carregando from "../components/Carregando";
import LocacaoForm from "../components/LocacaoForm";
import LocacaoLista from "../components/LocacaoLista";
import { finalizarLocacao, listarLocacoes } from "../services/locacaoService";
import { listarVeiculos } from "../services/veiculoService";
import { formatarMoeda, mensagemDeErro } from "../utils/formatacao";

const filtros = {
  todas: () => true,
  ativas: (locacao) => locacao.status === "ATIVA",
  finalizadas: (locacao) => locacao.status === "FINALIZADA",
};

function Locacoes() {
  const [veiculos, setVeiculos] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [atualizacao, setAtualizacao] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erroFinalizacao, setErroFinalizacao] = useState("");
  const [finalizandoId, setFinalizandoId] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarVeiculos(true), listarLocacoes()])
      .then(([veiculosDisponiveis, locacoesDoUsuario]) => {
        if (ativo) {
          setVeiculos(veiculosDisponiveis);
          setLocacoes(locacoesDoUsuario);
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
  }, [atualizacao]);

  function atualizar() {
    setAtualizacao((valor) => valor + 1);
  }

  function handleConcluida() {
    setMensagem("");
    setErroFinalizacao("");
    atualizar();
  }

  async function handleFinalizar(locacao) {
    setMensagem("");
    setErroFinalizacao("");
    setFinalizandoId(locacao.id);

    try {
      const finalizada = await finalizarLocacao(locacao.id);
      setMensagem(
        `Locação #${finalizada.id} finalizada. ${finalizada.veiculo.marca} ${finalizada.veiculo.modelo} está disponível novamente.`,
      );
    } catch (error) {
      setErroFinalizacao(mensagemDeErro(error));
    } finally {
      setFinalizandoId(null);
      atualizar();
    }
  }

  const locacoesFiltradas = locacoes.filter(filtros[filtro]);
  const ativas = locacoes.filter(filtros.ativas);
  const totalGasto = locacoes.reduce(
    (soma, locacao) => soma + Number(locacao.valorTotal),
    0,
  );

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1>Locações</h1>
        <p>
          Escolha um veículo disponível, defina o período e acompanhe seu
          histórico.
        </p>
      </div>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Alerta tipo="erro">{erro}</Alerta>
      ) : (
        <div className="grade">
          <section className="cartao">
            <h2>Nova locação</h2>
            <LocacaoForm veiculos={veiculos} onConcluida={handleConcluida} />
          </section>

          <section className="cartao cartao-largo">
            <div className="cartao-cabecalho">
              <h2>Minhas locações</h2>
              <div className="campo campo-inline">
                <label htmlFor="filtroLocacoes">Mostrar</label>
                <select
                  id="filtroLocacoes"
                  value={filtro}
                  onChange={(evento) => setFiltro(evento.target.value)}
                >
                  <option value="todas">Todas</option>
                  <option value="ativas">Ativas</option>
                  <option value="finalizadas">Finalizadas</option>
                </select>
              </div>
            </div>

            <div className="indicadores">
              <div>
                <span>Total</span>
                <strong>{locacoes.length}</strong>
              </div>
              <div>
                <span>Ativas</span>
                <strong>{ativas.length}</strong>
              </div>
              <div>
                <span>Valor acumulado</span>
                <strong>{formatarMoeda(totalGasto)}</strong>
              </div>
            </div>

            <Alerta tipo="sucesso" onFechar={() => setMensagem("")}>
              {mensagem}
            </Alerta>
            <Alerta tipo="erro" onFechar={() => setErroFinalizacao("")}>
              {erroFinalizacao}
            </Alerta>

            <LocacaoLista
              locacoes={locacoesFiltradas}
              finalizandoId={finalizandoId}
              onFinalizar={handleFinalizar}
            />
          </section>
        </div>
      )}
    </div>
  );
}

export default Locacoes;
