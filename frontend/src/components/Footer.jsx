// Подвал сайта: логотип и три колонки со ссылками и контактами.
// Ссылки вида "/#faq" ведут к блоку на главной странице (прокрутку делает Home.jsx).
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Светлая версия логотипа с описанием: подвал тёмный */}
        <img className="footer__logo" src="/images/logo-light-desc.png" alt="Выше: онлайн школа по подготовке к ОГЭ/ЕГЭ" />

        <div className="footer__columns">
          <div className="footer__column">
            <h3 className="footer__title">О компании</h3>
            <ul>
              <li><Link to="/about">О Выше</Link></li>
              <li><Link to="/#reviews">Отзывы</Link></li>
              <li><Link to="/#faq">Вопросы</Link></li>
              <li><Link to="/soon">Вакансии</Link></li>
              <li><Link to="/soon">Сведения об образовательной организации</Link></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Обучение</h3>
            <ul>
              <li><Link to="/oge">ОГЭ</Link></li>
              <li><Link to="/ege">ЕГЭ</Link></li>
              <li><Link to="/#team">Преподаватели</Link></li>
              <li><Link to="/#tariffs">Тарифы</Link></li>
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
