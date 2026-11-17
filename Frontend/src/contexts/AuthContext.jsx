import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCarregando(false);
      return;
    }

    api
      .get("/auth/me")
      .then((resposta) => setUsuario(resposta.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setCarregando(false));
  }, []);

  async function login(email, senha) {
    const resposta = await api.post("/auth/login", { email, senha });
    localStorage.setItem("token", resposta.data.token);
    setUsuario(resposta.data.usuario);
  }

  async function cadastrar(nome, email, senha) {
    await api.post("/auth/register", { nome, email, senha });
  }

  function logout() {
    localStorage.removeItem("token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, login, cadastrar, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}