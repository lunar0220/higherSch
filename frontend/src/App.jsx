// Главный файл приложения. Здесь описано, какой адрес какую страницу открывает.
// Шапка и подвал стоят вне Routes, поэтому видны на всех страницах.
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ComingSoon from "./components/ComingSoon";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Exam from "./pages/Exam";
import Login from "./pages/Login";
import CabinetLayout from "./pages/cabinet/CabinetLayout";
import CabinetHome from "./pages/cabinet/CabinetHome";
import MyCourses from "./pages/cabinet/MyCourses";
import CourseLessons from "./pages/cabinet/CourseLessons";
import Lesson from "./pages/cabinet/Lesson";
import Homework from "./pages/cabinet/Homework";

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Страница ОГЭ готова. Страница ЕГЭ пока в разработке:
              чтобы включить её, замените ComingSoon на <Exam key="ege" exam="ege" /> */}
          <Route path="/oge" element={<Exam key="oge" exam="oge" />} />
          <Route path="/ege" element={<ComingSoon title="ЕГЭ" />} />

          {/* Личный кабинет: пускаем только вошедших (ProtectedRoute) */}
          <Route
            path="/cabinet"
            element={
              <ProtectedRoute>
                <CabinetLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CabinetHome />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="courses/:courseId" element={<CourseLessons />} />
            <Route path="lessons/:lessonId" element={<Lesson />} />
            <Route path="homework" element={<Homework />} />
          </Route>

          {/* Разделы, которые ещё в разработке */}
          <Route path="/about" element={<ComingSoon title="О нас" />} />
          {/* "*" — любой другой адрес */}
          <Route path="*" element={<ComingSoon title="Раздел" />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
