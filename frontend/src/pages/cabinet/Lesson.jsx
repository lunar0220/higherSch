// Страница урока: название, описание, видео, конспект и задания.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/client";
import HomeworkForm from "./HomeworkForm";
import { toEmbedUrl } from "./helpers";

export default function Lesson() {
  const { lessonId } = useParams(); // номер урока берём из адреса /cabinet/lessons/:lessonId
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/lessons/${lessonId}/`)
      .then((response) => setLesson(response.data))
      .catch(() => setError(true));
  }, [lessonId]);

  if (error) return <p className="status">Урок не найден.</p>;
  if (!lesson) return <p className="status">Загружаем…</p>;

  // «Отметить пройденным» / «Снять отметку»: от этого зависит % прохождения курса
  async function toggleCompleted() {
    const response = await api.post(`/lessons/${lessonId}/complete/`, { completed: !lesson.completed });
    setLesson({ ...lesson, completed: response.data.completed });
  }

  // Когда ученик сдал задание, подставляем обновлённые данные в список
  function updateHomework(updated) {
    setLesson({
      ...lesson,
      homeworks: lesson.homeworks.map((h) => (h.id === updated.id ? updated : h)),
    });
  }

  const videoUrl = toEmbedUrl(lesson.video_url);

  return (
    <div className="cabinet__section">
      <p>
        <Link to={`/cabinet/courses/${lesson.course_id}`} className="back-link">
          ← {lesson.course_title}
        </Link>
      </p>

      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>

      {videoUrl ? (
        <iframe className="video" src={videoUrl} title={lesson.title} allowFullScreen />
      ) : (
        <div className="video video--empty">Видео скоро появится</div>
      )}

      <div className="center">
        <button className={"btn " + (lesson.completed ? "btn--blue" : "btn--navy")} onClick={toggleCompleted}>
          {lesson.completed ? "Урок пройден (снять отметку)" : "Отметить пройденным"}
        </button>
      </div>

      {lesson.notes && (
        <>
          <h2 className="cabinet__subtitle">Конспект</h2>
          <div className="notes">{lesson.notes}</div>
        </>
      )}

      {lesson.homeworks.length > 0 && (
        <>
          <h2 className="cabinet__subtitle">Задания</h2>
          {lesson.homeworks.map((homework) => (
            <HomeworkForm key={homework.id} homework={homework} onSaved={updateHomework} />
          ))}
        </>
      )}
    </div>
  );
}
