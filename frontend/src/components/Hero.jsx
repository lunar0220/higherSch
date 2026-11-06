// Первый экран: заголовок, подзаголовок, кнопка и иллюстрация.
// onApply — функция, которая открывает форму заявки (приходит из Home).
export default function Hero({ onApply }) {
  return (
    <section className="hero container">
      <div>
        <h1 className="title title--blue">Твой следующий уровень</h1>
        <p className="hero__subtitle">Поднимаемся вместе. Шаг за шагом — ещё выше.</p>
        <button className="btn btn--pink btn--big" onClick={() => onApply(null)}>
          Занять место
        </button>
      </div>
      {/* Картинка лежит в frontend/public/images */}
      <img className="illustration" src="/images/hero-stairs.svg" alt="Лестница вверх со стрелкой" />
    </section>
  );
}
