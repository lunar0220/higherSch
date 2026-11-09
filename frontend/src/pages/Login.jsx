import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import ApplicationModal from "../components/ApplicationModal";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(null);
  const [tariffs, setTariffs] = useState([]);

  useEffect(() => {
    api.get("/tariffs/").then((response) => setTariffs(response.data)).catch(() => {});
  }, []);

  if (user) return <Navigate to="/cabinet" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(username.trim(), password);
      navigate("/cabinet");
    } catch (e) {
      setError("Неверный логин или пароль");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="login container">
      <h1 className="title title--blue login__title">Вход</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        <label className="field">
          Логин
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </label>

        <label className="field">
          Пароль
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn btn--navy btn--wide" disabled={busy}>
          {busy ? "Входим…" : "Войти"}
        </button>
      </form>

      <div className="login__new">
        <h2>Я тут впервые</h2>
        <button
          className="btn btn--blue btn--wide"
          onClick={() => setModal({ title: "Узнать о платформе", kindNote: "Хочу узнать о платформе" })}
        >
          Хочу узнать о платформе
        </button>
        <button
          className="btn btn--pink btn--wide"
          onClick={() => setModal({ title: "Оплата обучения", kindNote: "Хочу оплатить обучение" })}
        >
          Хочу оплатить обучение
        </button>
      </div>

      {modal && (
        <ApplicationModal
          tariffs={tariffs}
          initialTariff={null}
          title={modal.title}
          kindNote={modal.kindNote}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  );
}
