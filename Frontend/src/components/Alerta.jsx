function Alerta({ tipo = "erro", children, onFechar }) {
  if (!children) {
    return null;
  }

  return (
    <div
      className={`alerta alerta-${tipo}`}
      role={tipo === "erro" ? "alert" : "status"}
    >
      <span>{children}</span>
      {onFechar && (
        <button
          type="button"
          className="alerta-fechar"
          onClick={onFechar}
          aria-label="Fechar mensagem"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alerta;
