// Шапка сайта: логотип, меню и кнопка входа (после входа она ведёт в кабинет).
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        {/* Картинки лежат в папке public/images */}
        <img src="/images/logo-dark.png" alt="Выше" />
      </Link>

      <nav className="header__nav">
        <NavLink to="/oge">ОГЭ</NavLink>
        <NavLink to="/ege">ЕГЭ</NavLink>
        <NavLink to="/about">О нас</NavLink>
      </nav>

      <Link to={user ? "/cabinet" : "/login"} className="header__login">
        <svg viewBox="0 0 24 22" fill="none" stroke="#17293e" strokeWidth="2.6" strokeLinejoin="round">
          <path d="M9 1.5H5.2A2.7 2.7 0 0 0 2.5 4.2v13.6a2.7 2.7 0 0 0 2.7 2.7H9" />
          <path d="M6.5 11H22.5M17.5 5.8 22.5 11l-5 5.2" />
        </svg>
        <span>{user ? "Кабинет" : "Войти"}</span>
      </Link>
    </header>
  );
}
