// Блок «Как проходит обучение?». Вкладки переключают описание.
// useState хранит номер выбранной вкладки; при клике номер меняется и React перерисовывает блок.
import { useState } from "react";

// Тексты можно менять прямо здесь
const STEPS = [
  { name: "Теория", text: "Короткие видеоуроки и конспекты: только то, что нужно для экзамена." },
  { name: "Практика", text: "На онлайн-вебинаре практикуешься вместе с преподавателем в рабочей тетради." },
  { name: "Тесты", text: "Задания с автопроверкой: сразу видишь результат и ошибки." },
  { name: "ДЗ", text: "Домашние задания по каждой теме, куратор следит за выполнением." },
  { name: "Пробники", text: "Пробные экзамены в формате настоящего ЕГЭ или ОГЭ с разбором ошибок." },
  { name: "Зачёты", text: "Проверяем, что тема усвоена, прежде чем идти дальше." },
];

export default function HowItWorks() {
  const [active, setActive] = useState(1);

  return (
    <section className="section container how">
      <h2 className="title title--navy">Как проходит обучение?</h2>

      <div className="how__tabs">
        {STEPS.map((step, i) => (
          <button
            key={step.name}
            className={"how__tab" + (i === active ? " how__tab--active" : "")}
            onClick={() => setActive(i)}
          >
            {step.name}
          </button>
        ))}
      </div>

      <p className="how__text">{STEPS[active].text}</p>
      <img className="illustration how__image" src="/images/learning.svg" alt="Онлайн-занятие: ноутбук и рабочая тетрадь" />
    </section>
  );
}
