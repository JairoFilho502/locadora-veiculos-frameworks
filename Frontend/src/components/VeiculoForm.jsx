import { useState } from "react";
import Alerta from "./Alerta";
import { cadastrarVeiculo } from "../services/veiculoService";
import { mensagemDeErro } from "../utils/formatacao";

function VeiculoForm({ onCadastrado }) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [valorDiaria, setValorDiaria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    setEnviando(true);

    try {
      await cadastrarVeiculo({
        marca,
        modelo,
        placa,
        ano: Number(ano),
        valorDiaria: Number(valorDiaria),
      });
      setMensagem("Veículo cadastrado com sucesso!");
      setMarca("");
      setModelo("");
      setPlaca("");
      setAno("");
      setValorDiaria("");
      onCadastrado();
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={handleSubmit} noValidate>
      <div className="campo">
        <label htmlFor="marca">Marca</label>
        <input
          id="marca"
          type="text"
          value={marca}
          onChange={(evento) => setMarca(evento.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="modelo">Modelo</label>
        <input
          id="modelo"
          type="text"
          value={modelo}
          onChange={(evento) => setModelo(evento.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="placa">Placa</label>
        <input
          id="placa"
          type="text"
          maxLength={8}
          value={placa}
          onChange={(evento) => setPlaca(evento.target.value.toUpperCase())}
        />
      </div>

      <div className="campo">
        <label htmlFor="ano">Ano</label>
        <input
          id="ano"
          type="number"
          value={ano}
          onChange={(evento) => setAno(evento.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="valorDiaria">Valor da diária (R$)</label>
        <input
          id="valorDiaria"
          type="number"
          step="0.01"
          value={valorDiaria}
          onChange={(evento) => setValorDiaria(evento.target.value)}
        />
      </div>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? "Cadastrando..." : "Cadastrar"}
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

export default VeiculoForm;
