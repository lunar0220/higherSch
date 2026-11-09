// Два блока под первым экраном: большой логотип с пояснением и розовый блок «Потолка нет».
export default function Intro() {
  return (
    <>
      <section className="brand container">
        <img className="brand__logo" src="/images/logo-dark.png" alt="Выше" />
        <p className="brand__text">
          — это не про набор уроков, а маршрут: от стартовой точки до пробного экзамена.
        </p>
      </section>

      <section className="ceiling container">
        <div className="pink-block">
          <h2 className="pink-block__title">
            Потолка нет.<br />Есть следующая ступень.
          </h2>
          <p className="pink-block__text">
            Экзамен — не предел возможностей, а один из этапов пути. Мы не пугаем провалом и не
            обещаем чудес: выстраиваем маршрут, по которому каждый поднимается в своём темпе.
          </p>
        </div>
      </section>
    </>
  );
}
