import Badge from "./Badge";
import { formatarDataHora, formatarMoeda } from "../utils/formatacao";

function LocacaoLista({ locacoes, finalizandoId, onFinalizar }) {
  if (locacoes.length === 0) {
    return <p className="vazio">Nenhuma locação encontrada.</p>;
  }

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Período contratado</th>
            <th>Devolvido em</th>
            <th>Valor total</th>
            <th>Status</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => {
            const ativa = locacao.status === "ATIVA";
            const atrasada =
              ativa && new Date(locacao.dataPrevistaDevolucao) < new Date();

            return (
              <tr key={locacao.id}>
                <td>
                  <strong>
                    {locacao.veiculo.marca} {locacao.veiculo.modelo}
                  </strong>
                  <span className="subtexto">
                    #{locacao.id} · {locacao.veiculo.placa}
                  </span>
                </td>
                <td>
                  {formatarDataHora(locacao.dataInicio)}
                  <span className="subtexto">
                    até {formatarDataHora(locacao.dataPrevistaDevolucao)}
                  </span>
                </td>
                <td>{formatarDataHora(locacao.dataDevolucao)}</td>
                <td className="valor">{formatarMoeda(locacao.valorTotal)}</td>
                <td>
                  {ativa ? (
                    <Badge tipo={atrasada ? "alerta" : "ativa"}>
                      {atrasada ? "Ativa · atrasada" : "Ativa"}
                    </Badge>
                  ) : (
                    <Badge tipo="neutro">Finalizada</Badge>
                  )}
                </td>
                <td className="acoes">
                  {ativa && (
                    <button
                      type="button"
                      className="botao botao-pequeno"
                      disabled={finalizandoId !== null}
                      onClick={() => onFinalizar(locacao)}
                    >
                      {finalizandoId === locacao.id
                        ? "Finalizando..."
                        : "Finalizar"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LocacaoLista;
