import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
      setMensagem("Cadastro realizado com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErro(error.response?.data?.error || "Não foi possível conectar à API");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />
        </div>

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Cadastrar"}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
      {erro && <p>{erro}</p>}

      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}

export default Cadastro;