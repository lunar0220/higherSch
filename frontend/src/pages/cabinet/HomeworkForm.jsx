import { useState } from "react";

import api from "../../api/client";
import { formatDate } from "./helpers";

export default function HomeworkForm({ homework, onSaved }) {
  const [answer, setAnswer] = useState(homework.answer);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await api.post(`/homework/${homework.id}/submit/`, { answer });
      onSaved(response.data);
      setStatus("saved");
    } catch (e) {
      setError(e.response?.data?.answer?.[0] || "Не получилось отправить. Попробуйте ещё раз.");
      setStatus("idle");
    }
  }

  return (
    <div className="hw-card">
      <div className="hw-card__head">
        <div>
          <h3>{homework.title}</h3>
          <p>{homework.kind_label} · срок сдачи: {formatDate(homework.deadline)}</p>
        </div>
        <span className={`badge badge--${homework.status}`}>{homework.status_label}</span>
      </div>

      {homework.description && <p>{homework.description}</p>}
      {homework.grade !== null && <p><strong>Оценка: {homework.grade}</strong></p>}
      {homework.teacher_comment && <p>Комментарий преподавателя: {homework.teacher_comment}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Напишите ответ"
        />
        {error && <p className="error-msg">{error}</p>}
        {status === "saved" && <p>Ответ отправлен.</p>}
        <button className="btn btn--navy" disabled={status === "sending"}>
          {homework.status === "not_done" ? "Сдать" : "Отправить заново"}
        </button>
      </form>
    </div>
  );
}
