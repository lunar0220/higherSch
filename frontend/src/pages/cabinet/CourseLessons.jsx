// Страница одного курса: полоска прогресса и список его уроков.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/client";

export default function CourseLessons() {
  const { courseId } = useParams(); // номер курса берём из адреса /cabinet/courses/:courseId
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/my/courses/${courseId}/`)
      .then((response) => setCourse(response.data))
      .catch(() => setError(true));
  }, [courseId]);

  if (error) return <p className="status">Курс не найден.</p>;
  if (!course) return <p className="status">Загружаем…</p>;

  return (
    <div className="cabinet__section">
      <p><Link to="/cabinet/courses" className="back-link">← Все курсы</Link></p>
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <div className="course-progress">
        <p className="cab-card__label">Пройдено {course.progress}%</p>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${course.progress}%` }} />
        </div>
      </div>

      <div className="lessons">
        {course.lessons.map((lesson, i) => (
          <Link key={lesson.id} to={`/cabinet/lessons/${lesson.id}`} className="lesson-row">
            <span className="lesson-row__number">{i + 1}</span>
            <div className="lesson-row__text">
              <strong>{lesson.title}</strong>
              <span>{lesson.description}</span>
            </div>
            <span className={"badge " + (lesson.completed ? "badge--done" : "badge--not_done")}>
              {lesson.completed ? "Пройден" : "Не пройден"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
