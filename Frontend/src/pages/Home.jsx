import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import Carregando from "../components/Carregando";
import { useAuth } from "../contexts/AuthContext";
import { listarLocacoes } from "../services/locacaoService";
import { listarVeiculos } from "../services/veiculoService";
import { mensagemDeErro } from "../utils/formatacao";

function Home() {
  const { usuario } = useAuth();
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    Promise.all([listarVeiculos(), listarLocacoes()])
      .then(([veiculos, locacoes]) => {
        if (ativo) {
          setResumo({
            frota: veiculos.length,
            disponiveis: veiculos.filter((veiculo) => veiculo.disponivel)
              .length,
            ativas: locacoes.filter((locacao) => locacao.status === "ATIVA")
              .length,
            finalizadas: locacoes.filter(
              (locacao) => locacao.status === "FINALIZADA",
            ).length,
          });
        }
      })
      .catch((error) => {
        if (ativo) {
          setErro(mensagemDeErro(error));
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1>Olá, {usuario.nome}!</h1>
        <p>Você está conectado como {usuario.email}.</p>
      </div>

      <Alerta tipo="erro">{erro}</Alerta>

      {!resumo && !erro && <Carregando />}

      {resumo && (
        <div className="indicadores indicadores-destaque">
          <div>
            <span>Veículos na frota</span>
            <strong>{resumo.frota}</strong>
          </div>
          <div>
            <span>Disponíveis agora</span>
            <strong>{resumo.disponiveis}</strong>
          </div>
          <div>
            <span>Minhas locações ativas</span>
            <strong>{resumo.ativas}</strong>
          </div>
          <div>
            <span>Minhas locações finalizadas</span>
            <strong>{resumo.finalizadas}</strong>
          </div>
        </div>
      )}

      <div className="atalhos">
        <Link to="/locacoes" className="cartao atalho">
          <h2>Alugar um veículo</h2>
          <p>
            Escolha um veículo disponível, defina as datas e consulte seu
            histórico.
          </p>
        </Link>
        <Link to="/veiculos" className="cartao atalho">
          <h2>Gerenciar a frota</h2>
          <p>Cadastre veículos e filtre a listagem por disponibilidade.</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
