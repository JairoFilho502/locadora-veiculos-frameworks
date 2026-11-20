import { useState } from "react";
import Alerta from "./Alerta";
import { registrarLocacao } from "../services/locacaoService";
import {
  calcularDiarias,
  formatarMoeda,
  mensagemDeErro,
  paraISO,
  paraInputDataHora,
} from "../utils/formatacao";

function datasIniciais() {
  const inicio = new Date();
  inicio.setSeconds(0, 0);
  const fim = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
  return { inicio: paraInputDataHora(inicio), fim: paraInputDataHora(fim) };
}

function LocacaoForm({ veiculos, onConcluida }) {
  const [veiculoId, setVeiculoId] = useState("");
  const [dataInicio, setDataInicio] = useState(() => datasIniciais().inicio);
  const [dataPrevistaDevolucao, setDataPrevistaDevolucao] = useState(
    () => datasIniciais().fim,
  );
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const veiculoSelecionado = veiculos.find(
    (veiculo) => String(veiculo.id) === veiculoId,
  );
  const diarias = calcularDiarias(dataInicio, dataPrevistaDevolucao);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    setEnviando(true);

    try {
      const locacao = await registrarLocacao({
        veiculoId: veiculoSelecionado ? veiculoSelecionado.id : "",
        dataInicio: paraISO(dataInicio),
        dataPrevistaDevolucao: paraISO(dataPrevistaDevolucao),
      });
      setMensagem(
        `Locação registrada: ${locacao.veiculo.marca} ${locacao.veiculo.modelo}, valor total de ${formatarMoeda(locacao.valorTotal)}.`,
      );
      setVeiculoId("");
      const datas = datasIniciais();
      setDataInicio(datas.inicio);
      setDataPrevistaDevolucao(datas.fim);
      onConcluida();
    } catch (error) {
      setErro(mensagemDeErro(error));
      onConcluida();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={handleSubmit} noValidate>
      <div className="campo">
        <label htmlFor="veiculoId">Veículo</label>
        <select
          id="veiculoId"
          value={veiculoSelecionado ? veiculoId : ""}
          onChange={(evento) => setVeiculoId(evento.target.value)}
        >
          <option value="">
            {veiculos.length === 0
              ? "Nenhum veículo disponível"
              : "Selecione um veículo disponível"}
          </option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} · {veiculo.placa} ·{" "}
              {formatarMoeda(veiculo.valorDiaria)}/dia
            </option>
          ))}
        </select>
      </div>

      <div className="formulario">
        <div className="campo">
          <label htmlFor="dataInicio">Início</label>
          <input
            id="dataInicio"
            type="datetime-local"
            value={dataInicio}
            onChange={(evento) => setDataInicio(evento.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="dataPrevistaDevolucao">Devolução prevista</label>
          <input
            id="dataPrevistaDevolucao"
            type="datetime-local"
            value={dataPrevistaDevolucao}
            onChange={(evento) => setDataPrevistaDevolucao(evento.target.value)}
          />
        </div>
      </div>

      <div className="resumo">
        {veiculoSelecionado && diarias > 0 ? (
          <>
            <span>
              {diarias} {diarias === 1 ? "diária" : "diárias"} ×{" "}
              {formatarMoeda(veiculoSelecionado.valorDiaria)}
            </span>
            <strong>
              Estimativa:{" "}
              {formatarMoeda(diarias * Number(veiculoSelecionado.valorDiaria))}
            </strong>
          </>
        ) : (
          <span>Escolha o veículo e o período para ver a estimativa.</span>
        )}
      </div>
      <p className="dica">
        Cada fração de 24 horas conta como uma diária. O valor final é calculado
        pela API.
      </p>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? "Registrando..." : "Registrar locação"}
      </button>

      <Alerta tipo="sucesso" onFechar={() => setMensagem("")}>
        {mensagem}
      </Alerta>
      <Alerta tipo="erro" onFechar={() => setErro("")}>
        {erro}
      </Alerta>
    </form>
  );
}

export default LocacaoForm;
