// Блок «Выбирай удобный формат подготовки»: три тарифа из базы (/api/tariffs/).
// Цвет карточки зависит от порядкового номера: тёмная, голубая, розовая.
import { Fragment } from "react";

const COLORS = ["navy", "blue", "pink"];

// В тексте пункта знак "|" означает перенос строки: «Диагностика|и персональный план»
function renderLines(text) {
  return text.split("|").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

export default function Tariffs({ tariffs, onApply }) {
  return (
    <section id="tariffs" className="tariffs-section container">
      <h2 className="title title--pink title--justify">Выбирай удобный формат подготовки</h2>

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
                    <li key={feature}>{renderLines(feature)}</li>
                  ))}
                </ul>
              </div>
              <button className={`tariff__btn tariff__btn--${color}`} onClick={() => onApply(tariff)}>
                Начать подготовку
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
