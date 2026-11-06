// Подвал сайта: три колонки со ссылками и контактами.
// Ссылки вида "/#faq" ведут на блок главной страницы (подключим при сборке главной).
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="header__logo">Выше ↗</div>
        <p>онлайн школа по подготовке к ОГЭ/ЕГЭ</p>

        <div className="footer__columns">
          <div className="footer__column">
            <h3 className="footer__title">О компании</h3>
            <ul>
              <li><Link to="/about">О Выше</Link></li>
              <li><a href="/#reviews">Отзывы</a></li>
              <li><a href="/#faq">Вопросы</a></li>
              <li><Link to="/soon">Вакансии</Link></li>
              <li><Link to="/soon">Сведения об образовательной организации</Link></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Обучение</h3>
            <ul>
              <li><Link to="/oge">ОГЭ</Link></li>
              <li><Link to="/ege">ЕГЭ</Link></li>
              <li><a href="/#team">Преподаватели</a></li>
              <li><a href="/#tariffs">Тарифы</a></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Контакты</h3>
            <ul>
              <li>+7 (900) 123-45-67</li>
              <li>@higherSch</li>
              <li>higherSch@mail.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
