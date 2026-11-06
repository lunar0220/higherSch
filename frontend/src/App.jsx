// Главный файл приложения. Здесь описано, какой адрес какую страницу открывает.
// Шапка и подвал стоят вне Routes, поэтому видны на всех страницах.
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ComingSoon from "./components/ComingSoon";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ege" element={<ComingSoon title="ЕГЭ" />} />
          <Route path="/oge" element={<ComingSoon title="ОГЭ" />} />
          <Route path="/about" element={<ComingSoon title="О нас" />} />
          {/* "*" — любой другой адрес */}
          <Route path="*" element={<ComingSoon title="Раздел" />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
