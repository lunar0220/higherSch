// Шапка сайта: логотип, меню и кнопка «Войти».
// NavLink — это ссылка, которая не перезагружает страницу
// и сама подсвечивает текущий раздел (класс "active").
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">Выше ↗</Link>

      <nav className="header__nav">
        <NavLink to="/oge">ОГЭ</NavLink>
        <NavLink to="/ege">ЕГЭ</NavLink>
        <NavLink to="/about">О нас</NavLink>
      </nav>

      <Link to="/login" className="btn btn--blue">Войти</Link>
    </header>
  );
}
