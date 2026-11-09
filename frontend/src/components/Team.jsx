// Блок «Команда, с которой не страшно».
// Слева переключатель ЕГЭ/ОГЭ и список предметов, справа информация о выбранном преподавателе.
import { useState } from "react";

export default function Team({ teachers, onApply, initialExam = "ege" }) {
  const [exam, setExam] = useState(initialExam); // выбранный экзамен
  const [selectedId, setSelectedId] = useState(null); // выбранный преподаватель

  // Оставляем только преподавателей выбранного экзамена
  const list = teachers.filter((t) => t.exam_types.includes(exam));
  // Если никто не выбран, показываем преподавателя английского (как в макете) или первого
  const current =
    list.find((t) => t.id === selectedId) ||
    list.find((t) => t.subject === "Английский язык") ||
    list[0];

  return (
    <section id="team" className="team-section container">
      <h2 className="title title--blue title--justify">Команда, с которой не страшно</h2>

      <div className="team">
        <div className="team__exams">
          <button
            className={"team__exam" + (exam === "ege" ? " team__exam--active" : "")}
            onClick={() => setExam("ege")}
          >ЕГЭ</button>
          <button
            className={"team__exam" + (exam === "oge" ? " team__exam--active" : "")}
            onClick={() => setExam("oge")}
          >ОГЭ</button>
        </div>

        <ul className="team__subjects">
          {list.map((t) => (
            <li key={t.id}>
              <button
                className={"team__subject" + (current && t.id === current.id ? " team__subject--active" : "")}
                onClick={() => setSelectedId(t.id)}
              >
                {t.subject}
              </button>
            </li>
          ))}
        </ul>

        {current && (
          <>
            {/* Если фото нет, рисуем серый силуэт, как в макете */}
            {current.photo ? (
              <img className="team__avatar team__photo" src={current.photo} alt={current.name} />
            ) : (
              <svg className="team__avatar" viewBox="0 0 440 545">
                <circle cx="199" cy="107" r="107.5" fill="#d9d9d9" />
                <ellipse cx="199" cy="491" rx="240" ry="261" fill="#d9d9d9" />
              </svg>
            )}

            <h3 className="team__name">{current.name}</h3>
            <ul className="team__facts">
              {current.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <button className="team__btn" onClick={() => onApply(null)}>
              Начать подготовку
            </button>
          </>
        )}
      </div>
    </section>
  );
}
