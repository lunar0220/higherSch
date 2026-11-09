// Главная кабинета: мои курсы с прогрессом и траекторией, ближайшие задания и пробники.
import { useEffect, useState } from "react";

import api from "../../api/client";
import CourseCard from "./CourseCard";
import HomeworkRow from "./HomeworkRow";

const COLORS = ["pink", "blue"];

export default function CabinetHome() {
  const [courses, setCourses] = useState([]);
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/my/courses/"), api.get("/my/homework/")])
      .then(([coursesResponse, homeworkResponse]) => {
        setCourses(coursesResponse.data);
        setHomework(homeworkResponse.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Загружаем…</p>;
  if (error) return <p className="status">Не удалось загрузить данные кабинета.</p>;

  // Ближайшие задания: ещё не выполненные домашки
  const upcoming = homework.filter((h) => h.kind === "homework" && h.status === "not_done").slice(0, 4);
  // Пробники: задания особого типа
  const mocks = homework.filter((h) => h.kind === "mock");

  return (
    <>
      <div className="cabinet__section">
        <h2>Мои курсы</h2>
        {courses.length === 0 ? (
          <p>Вы пока не записаны ни на один курс. Мы добавим его после оплаты.</p>
        ) : (
          <div className="cab-cards">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} color={COLORS[i % COLORS.length]} />
            ))}
          </div>
        )}
      </div>

      <div className="cabinet__section">
        <h2>Ближайшие домашки</h2>
        {upcoming.length === 0 ? (
          <p>Все домашние задания выполнены. Отличная работа!</p>
        ) : (
          <div className="hw-list">
            {upcoming.map((h) => <HomeworkRow key={h.id} homework={h} />)}
          </div>
        )}
      </div>

      <div className="cabinet__section">
        <h2>Пробные экзамены</h2>
        {mocks.length === 0 ? (
          <p>Пробных экзаменов пока нет.</p>
        ) : (
          <div className="hw-list">
            {mocks.map((h) => <HomeworkRow key={h.id} homework={h} />)}
          </div>
        )}
      </div>
    </>
  );
}
