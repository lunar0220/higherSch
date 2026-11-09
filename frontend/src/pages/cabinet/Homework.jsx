import { useEffect, useState } from "react";

import api from "../../api/client";
import HomeworkRow from "./HomeworkRow";

export default function Homework() {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get("/my/homework/")
      .then((response) => setHomework(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Загружаем…</p>;
  if (error) return <p className="status">Не удалось загрузить задания.</p>;

  return (
    <div className="cabinet__section">
      <h2>Домашки</h2>
      {homework.length === 0 ? (
        <p>Заданий пока нет.</p>
      ) : (
        <div className="hw-list">
          {homework.map((h) => <HomeworkRow key={h.id} homework={h} />)}
        </div>
      )}
    </div>
  );
}
