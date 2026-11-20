import Badge from "./Badge";
import { formatarMoeda } from "../utils/formatacao";

function VeiculoLista({ veiculos }) {
  if (veiculos.length === 0) {
    return <p className="vazio">Nenhum veículo encontrado.</p>;
  }

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>{veiculo.marca}</td>
              <td>{veiculo.modelo}</td>
              <td>{veiculo.placa}</td>
              <td>{veiculo.ano}</td>
              <td className="valor">{formatarMoeda(veiculo.valorDiaria)}</td>
              <td>
                {veiculo.disponivel ? (
                  <Badge tipo="ativa">Disponível</Badge>
                ) : (
                  <Badge tipo="neutro">Indisponível</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VeiculoLista;
