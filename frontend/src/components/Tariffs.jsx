// Блок «Выбирай удобный формат подготовки»: три тарифа из базы (/api/tariffs/).
// Цвет карточки зависит от порядкового номера: тёмная, голубая, розовая.
const COLORS = ["navy", "blue", "pink"];

export default function Tariffs({ tariffs, onApply }) {
  return (
    <section id="tariffs" className="section container">
      <h2 className="title title--pink">Выбирай удобный формат подготовки</h2>

      <div className="tariffs">
        {tariffs.map((tariff, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <div key={tariff.id} className="tariff-col">
              <div className={`tariff tariff--${color}`}>
                <h3>{tariff.name}</h3>
                <p className="tariff__price">
                  от {tariff.price_per_month.toLocaleString("ru-RU")} ₽ / мес
                </p>
                <ul className="tariff__features">
                  {tariff.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button className={`btn btn--wide btn--${color}`} onClick={() => onApply(tariff)}>
                Начать подготовку
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
