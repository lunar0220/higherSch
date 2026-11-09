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

          <Route path="/oge" element={<Exam key="oge" exam="oge" />} />
          <Route path="/ege" element={<ComingSoon title="ЕГЭ" />} />

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

          <Route path="/about" element={<ComingSoon title="О нас" />} />
          <Route path="*" element={<ComingSoon title="Раздел" />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
