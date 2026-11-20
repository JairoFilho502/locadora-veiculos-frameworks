function Badge({ tipo, children }) {
  return <span className={`badge badge-${tipo}`}>{children}</span>;
}

export default Badge;
