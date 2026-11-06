// Два блока под первым экраном: большой логотип с пояснением и розовый блок «Потолка нет».
export default function Intro() {
  return (
    <>
      <section className="section container brand">
        <div className="brand__logo">
          <img src="/images/logo-dark.png" alt="Выше" />
        </div>
        <p className="brand__text">
          — это не про набор уроков, а маршрут: от стартовой точки до пробного экзамена.
        </p>
      </section>

      <section className="section container">
        <div className="pink-block">
          <h2 className="title title--blue">Потолка нет. Есть следующая ступень.</h2>
          <p>
            Экзамен — не предел возможностей, а один из этапов пути. Мы не пугаем провалом
            и не обещаем чудес: выстраиваем маршрут, по которому каждый поднимается в своём темпе.
          </p>
        </div>
      </section>
    </>
  );
}
