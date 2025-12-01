export default function StatusCard({ name, status }) {
  const tone =
    status === "Healthy" ? "ok" : status === "Degraded" ? "warn" : "bad";

  return (
    <div className={`card ${tone}`}>
      <div className="cardTitle">{name}</div>
      <div className="cardStatus">{status}</div>
    </div>
  );
}
