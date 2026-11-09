export default function Hero({ onApply }) {
  return (
    <section className="hero container">
      <div className="hero__text">
        <h1 className="title title--blue">Твой следующий уровень</h1>
        <p className="hero__subtitle">Поднимаемся вместе. Шаг за шагом — ещё выше.</p>
        <button className="hero__btn" onClick={() => onApply(null)}>
          Занять место
        </button>
      </div>
      <img className="hero__photo" src="/images/hero-photo.jpg" alt="" />
    </section>
  );
}
