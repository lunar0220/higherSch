// Заглушка для разделов, которые ещё в разработке.
// Принимает заголовок через props: <ComingSoon title="Вакансии" />
export default function ComingSoon({ title = "Раздел" }) {
  return (
    <div className="soon container">
      <h1>{title}</h1>
      <p>Этот раздел находится в разработке. Скоро здесь всё появится.</p>
    </div>
  );
}
