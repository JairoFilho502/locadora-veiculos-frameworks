import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import { useAuth } from "../contexts/AuthContext";
import { mensagemDeErro } from "../utils/formatacao";

function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    setEnviando(true);

    try {
      await cadastrar(nome, email, senha);
      setMensagem(
        "Cadastro realizado com sucesso! Redirecionando para o login...",
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="tela-acesso">
      <div className="cartao cartao-acesso">
        <p className="marca">Locadora</p>
        <h1>Criar conta</h1>

        <form className="formulario" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
            />
          </div>

          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? "Enviando..." : "Cadastrar"}
          </button>
        </form>

        <Alerta tipo="sucesso">{mensagem}</Alerta>
        <Alerta tipo="erro">{erro}</Alerta>

        <p className="rodape-acesso">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
