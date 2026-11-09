import { useEffect, useState } from "react";

import api from "../../api/client";
import CourseCard from "./CourseCard";

const COLORS = ["pink", "blue"];

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get("/my/courses/")
      .then((response) => setCourses(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Загружаем…</p>;
  if (error) return <p className="status">Не удалось загрузить курсы.</p>;

  return (
    <div className="cabinet__section">
      <h2>Мои курсы</h2>
      {courses.length === 0 ? (
        <p>Вы пока не записаны ни на один курс.</p>
      ) : (
        <div className="cab-cards">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} color={COLORS[i % COLORS.length]} />
          ))}
        </div>
      )}
    </div>
  );
}
