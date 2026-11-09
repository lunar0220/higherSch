// Карточка курса: название, полоска прогресса и «траектория» баллов.
// Используется на главной кабинета и на странице «Мои курсы».
import { Link } from "react-router-dom";

export default function CourseCard({ course, color }) {
  return (
    <Link to={`/cabinet/courses/${course.id}`} className={`cab-card cab-card--${color}`}>
      <h3>{course.title}</h3>
      {course.teacher_name && <p>Преподаватель: {course.teacher_name}</p>}

      <div>
        <p className="cab-card__label">Пройдено {course.progress}%</p>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${course.progress}%` }} />
        </div>
      </div>

      {/* Траектория: балл в начале, сейчас и желаемый */}
      <div className="trajectory">
        <div><span>Было</span><strong>{course.start_score ?? "—"}</strong></div>
        <div><span>Сейчас</span><strong>{course.current_score ?? "—"}</strong></div>
        <div><span>Цель</span><strong>{course.target_score ?? "—"}</strong></div>
      </div>
    </Link>
  );
}
