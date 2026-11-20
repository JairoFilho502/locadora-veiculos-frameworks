function formatarValor(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function VeiculoLista({ veiculos }) {
  if (veiculos.length === 0) {
    return <p>Nenhum veículo encontrado.</p>;
  }

  return (
    <table>
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
            <td>{formatarValor(veiculo.valorDiaria)}</td>
            <td>{veiculo.disponivel ? "Disponível" : "Indisponível"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VeiculoLista;