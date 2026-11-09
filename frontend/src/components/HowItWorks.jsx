import { useState } from "react";

const STEPS = [
  { name: "Теория", image: "/images/how/theory.jpg",
    text: "Короткие видеоуроки и конспекты: только то, что нужно для экзамена." },
  { name: "Практика", image: "/images/how/practice.jpg",
    text: "На онлайн-вебинаре, практикуешься вместе с преподавателем в рабочей тетради." },
  { name: "Тесты", image: "/images/how/tests.jpg",
    text: "Задания с автопроверкой: сразу видишь результат и ошибки." },
  { name: "ДЗ", image: "/images/how/homework.jpg",
    text: "Домашние задания по каждой теме, куратор следит за выполнением." },
  { name: "Пробники", image: "/images/how/mocks.jpg",
    text: "Пробные экзамены в формате настоящего ЕГЭ или ОГЭ с разбором ошибок." },
  { name: "Зачёты", image: "/images/how/credits.jpg",
    text: "Проверяем, что тема усвоена, прежде чем идти дальше." },
];

export default function HowItWorks() {
  const [active, setActive] = useState(1);

  return (
    <section className="how container">
      <h2 className="title title--navy how__title">Как проходит обучение?</h2>

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
      <img className="how__image" src={STEPS[active].image} alt={STEPS[active].name} />
    </section>
  );
}
