import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import api from "../api/client";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import HowItWorks from "../components/HowItWorks";
import Tariffs from "../components/Tariffs";
import Team from "../components/Team";
import FAQ from "../components/FAQ";
import ApplicationModal from "../components/ApplicationModal";

export default function Home() {
  const [data, setData] = useState({ tariffs: [], teachers: [], faq: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState({ open: false, tariff: null });
  const { hash } = useLocation();

  useEffect(() => {
    Promise.all([api.get("/tariffs/"), api.get("/teachers/"), api.get("/faq/")])
      .then(([tariffs, teachers, faq]) => {
        setData({ tariffs: tariffs.data, teachers: teachers.data, faq: faq.data });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p className="status container">Загружаем…</p>}
      {error && (
        <p className="status container">Не удалось загрузить данные. Проверьте, что бэкенд запущен.</p>
      )}

      {!loading && !error && (
        <>
          <Tariffs tariffs={data.tariffs} onApply={openForm} />
          <Team teachers={data.teachers} onApply={openForm} />
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
