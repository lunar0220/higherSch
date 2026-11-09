// Общая рамка личного кабинета: приветствие, меню кабинета и место для страницы.
// <Outlet /> — сюда React Router подставляет нужную страницу кабинета.
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CabinetLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <section className="cabinet container">
      <div className="cabinet__top">
        <h1 className="cabinet__hello">Привет, {user.first_name || user.username}!</h1>

        <nav className="cabinet__nav">
          <NavLink to="/cabinet" end>Главная</NavLink>
          <NavLink to="/cabinet/courses">Мои курсы</NavLink>
          <NavLink to="/cabinet/homework">Домашки</NavLink>
          <button onClick={handleLogout}>Выйти</button>
        </nav>
      </div>

      <Outlet />
    </section>
  );
}
