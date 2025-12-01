import { useEffect, useState } from "react";
import StatusCard from "./components/StatusCard.jsx";
import "./App.css";

export default function App() {
  const [envs, setEnvs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/status")
      .then((r) => r.json())
      .then(setEnvs)
      .catch(() => setEnvs([]));
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">DevOps StatusBoard</div>
        <div className="pill">React + Flask</div>
      </header>

      <main className="container">
        <div className="hero">
          <h1>Environment Health</h1>
          <p>Local demo dashboard (API → UI). Perfect for DevOps portfolios.</p>
        </div>

        <div className="grid">
          {envs.map((e) => (
            <StatusCard
              key={e.name}
              name={e.name}
              status={e.status}
              detail={e.detail}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
