// Одна строка в списке заданий: название, тип, срок, статус и оценка.
import { Link } from "react-router-dom";
import { formatDate } from "./helpers";

export default function HomeworkRow({ homework }) {
  return (
    <Link to={`/cabinet/lessons/${homework.lesson_id}`} className="hw-row">
      <div>
        <strong>{homework.title}</strong>
        <span className="hw-row__meta">
          {homework.kind_label} · {homework.course_title}
        </span>
      </div>
      <div className="hw-row__right">
        <span className="hw-row__deadline">до {formatDate(homework.deadline)}</span>
        <span className={`badge badge--${homework.status}`}>{homework.status_label}</span>
        {homework.grade !== null && <span className="hw-row__grade">Оценка: {homework.grade}</span>}
      </div>
    </Link>
  );
}
