import { useState } from "react";
import { cadastrarVeiculo } from "../services/veiculoService";

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
      setErro(error.response?.data?.error || "Não foi possível conectar à API");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="marca">Marca</label>
        <input
          id="marca"
          type="text"
          value={marca}
          onChange={(evento) => setMarca(evento.target.value)}
        />
      </div>

      <div>
        <label htmlFor="modelo">Modelo</label>
        <input
          id="modelo"
          type="text"
          value={modelo}
          onChange={(evento) => setModelo(evento.target.value)}
        />
      </div>

      <div>
        <label htmlFor="placa">Placa</label>
        <input
          id="placa"
          type="text"
          maxLength={8}
          value={placa}
          onChange={(evento) => setPlaca(evento.target.value.toUpperCase())}
        />
      </div>

      <div>
        <label htmlFor="ano">Ano</label>
        <input
          id="ano"
          type="number"
          value={ano}
          onChange={(evento) => setAno(evento.target.value)}
        />
      </div>

      <div>
        <label htmlFor="valorDiaria">Valor da diária (R$)</label>
        <input
          id="valorDiaria"
          type="number"
          step="0.01"
          value={valorDiaria}
          onChange={(evento) => setValorDiaria(evento.target.value)}
        />
      </div>

      <button type="submit" disabled={enviando}>
        {enviando ? "Cadastrando..." : "Cadastrar"}
      </button>

      {mensagem && <p>{mensagem}</p>}
      {erro && <p>{erro}</p>}
    </form>
  );
}

export default VeiculoForm;