// Страница экзамена (ОГЭ или ЕГЭ): описание, предметы, как проходит подготовка,
// преподаватели, цены и частые вопросы. Одна страница на оба экзамена:
// какой именно, зависит от параметра exam ("oge" или "ege").
import { useEffect, useState } from "react";

import api from "../api/client";
import HowItWorks from "../components/HowItWorks";
import Tariffs from "../components/Tariffs";
import Team from "../components/Team";
import FAQ from "../components/FAQ";
import ApplicationModal from "../components/ApplicationModal";

const TEXTS = {
  oge: {
    title: "Подготовка к ОГЭ",
    text:
      "ОГЭ — основной государственный экзамен для выпускников 9 классов. Для аттестата нужно сдать " +
      "русский язык и математику, а ещё два предмета ученик выбирает сам. Мы выстраиваем маршрут " +
      "от диагностики до пробного экзамена.",
  },
  ege: {
    title: "Подготовка к ЕГЭ",
    text:
      "ЕГЭ — единый государственный экзамен для выпускников 11 классов. Его результаты нужны " +
      "для аттестата и для поступления в вуз. Мы выстраиваем маршрут от диагностики " +
      "до пробного экзамена.",
  },
};

const COLORS = ["pink", "blue"];

export default function Exam({ exam }) {
  const [data, setData] = useState({ tariffs: [], teachers: [], courses: [], faq: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState({ open: false, tariff: null });

  // Загружаем данные для выбранного экзамена
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/tariffs/"),
      api.get("/teachers/", { params: { exam_type: exam } }),
      api.get("/courses/", { params: { exam_type: exam } }),
      api.get("/faq/", { params: { exam_type: exam } }),
    ])
      .then(([tariffs, teachers, courses, faq]) => {
        setData({ tariffs: tariffs.data, teachers: teachers.data, courses: courses.data, faq: faq.data });
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [exam]);

  const openForm = (tariff) => setModal({ open: true, tariff });
  const texts = TEXTS[exam];

  return (
    <>
      <section className="exam-intro container">
        <h1 className="title title--blue exam-intro__title">{texts.title}</h1>
        <div className="exam-intro__side">
          <p className="exam-intro__text">{texts.text}</p>
          <button className="hero__btn" onClick={() => openForm(null)}>Занять место</button>
        </div>
      </section>

      {loading && <p className="status container">Загружаем…</p>}
      {error && <p className="status container">Не удалось загрузить данные. Проверьте, что бэкенд запущен.</p>}

      {!loading && !error && (
        <>
          {data.courses.length > 0 && (
            <section className="courses-section container">
              <h2 className="title title--navy">Предметы</h2>
              <div className="courses">
                {data.courses.map((course, i) => (
                  <div key={course.id} className={`course-card course-card--${COLORS[i % COLORS.length]}`}>
                    <h3>{course.title}</h3>
                    {course.teacher_name && <p>Преподаватель: {course.teacher_name}</p>}
                    <p>
                      {course.lessons_count} занятий
                      {course.duration && ` · ${course.duration}`}
                    </p>
                    <p>{course.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <HowItWorks />
          <Tariffs tariffs={data.tariffs} onApply={openForm} />
          <Team teachers={data.teachers} onApply={openForm} initialExam={exam} />
          {data.faq.length > 0 && <FAQ items={data.faq} />}
        </>
      )}

      {modal.open && (
        <ApplicationModal
          tariffs={data.tariffs}
          initialTariff={modal.tariff}
          onClose={() => setModal({ open: false, tariff: null })}
        />
      )}
    </>
  );
}
