// Блок «Команда, с которой не страшно».
// Слева переключатель ЕГЭ/ОГЭ и список предметов, справа информация о выбранном преподавателе.
import { useState } from "react";

export default function Team({ teachers, onApply }) {
  const [exam, setExam] = useState("ege");   // выбранный экзамен
  const [selectedId, setSelectedId] = useState(null); // выбранный преподаватель

  // Оставляем только преподавателей выбранного экзамена
  const list = teachers.filter((t) => t.exam_types.includes(exam));
  // Если никто не выбран (или выбранного нет в списке), показываем первого
  const current = list.find((t) => t.id === selectedId) || list[0];

  return (
    <section id="team" className="section container">
      <h2 className="title title--blue">Команда, с которой не страшно</h2>

      <div className="team">
        <div className="team__left">
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
        </div>

        {current && (
          <>
            <div className="team__photo">
              {current.photo ? <img src={current.photo} alt={current.name} /> : <div className="team__avatar" />}
            </div>

            <div className="team__info">
              <h3>{current.name}</h3>
              <ul className="team__facts">
                {current.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              <button className="btn btn--blue" onClick={() => onApply(null)}>
                Начать подготовку
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
