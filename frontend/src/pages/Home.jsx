// Главная страница. Загружает данные с бэкенда и собирает блоки по порядку, как в дизайне.
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import api from "../api/client";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import HowItWorks from "../components/HowItWorks";
import Tariffs from "../components/Tariffs";
import Team from "../components/Team";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import ApplicationModal from "../components/ApplicationModal";

export default function Home() {
  const [data, setData] = useState({ tariffs: [], teachers: [], reviews: [], faq: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Состояние формы заявки: открыта ли и какой тариф выбран
  const [modal, setModal] = useState({ open: false, tariff: null });
  const { hash } = useLocation();

  // Один раз при открытии страницы запрашиваем все данные у бэкенда
  useEffect(() => {
    Promise.all([
      api.get("/tariffs/"),
      api.get("/teachers/"),
      api.get("/reviews/"),
      api.get("/faq/"),
    ])
      .then(([tariffs, teachers, reviews, faq]) => {
        setData({
          tariffs: tariffs.data,
          teachers: teachers.data,
          reviews: reviews.data,
          faq: faq.data,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Переход по ссылкам из подвала (/#faq, /#tariffs…): прокручиваем к нужному блоку
  useEffect(() => {
    if (!loading && hash) {
      document.querySelector(hash)?.scrollIntoView();
    }
  }, [loading, hash]);

  const openForm = (tariff) => setModal({ open: true, tariff });

  return (
    <>
      <Hero onApply={openForm} />
      <Intro />
      <HowItWorks />

      {loading && <p className="container status">Загружаем…</p>}
      {error && (
        <p className="container status">Не удалось загрузить данные. Проверьте, что бэкенд запущен.</p>
      )}

      {!loading && !error && (
        <>
          <Tariffs tariffs={data.tariffs} onApply={openForm} />
          <Team teachers={data.teachers} onApply={openForm} />
          <Reviews reviews={data.reviews} />
          <FAQ items={data.faq} />
        </>
      )}

      {modal.open && (
        <ApplicationModal
          tariffs={data.tariffs}
          initialTariff={modal.tariff}
          onClose={() => setModal({ open: false, tariff: null })}
        />
      )}
    </>
  );
}
