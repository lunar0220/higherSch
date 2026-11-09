import { useState } from "react";
import api from "../api/client";

function normalizePhone(raw) {
  const text = raw.trim();
  if (!/^[\d\s()+-]+$/.test(text)) return null;
  const digits = text.replace(/\D/g, ""); 
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) return "+7" + digits.slice(1);
  if (digits.length === 10 && digits[0] === "9") return "+7" + digits;
  if (text.startsWith("+") && digits.length >= 10 && digits.length <= 15) return "+" + digits;
  return null;
}

export default function ApplicationModal({
  tariffs,
  initialTariff,
  onClose,
  title = "Занять место",
  kindNote = "",
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [tariffId, setTariffId] = useState(initialTariff ? initialTariff.id : "");
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState("idle");

  function handlePhoneChange(event) {
    setPhone(event.target.value.replace(/[^\d\s()+-]/g, ""));
    setPhoneError("");
  }

  async function handleSubmit(event) {
    event.preventDefault(); // не перезагружать страницу

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      setPhoneError("Введите номер телефона, например +7 900 123-45-67");
      return;
    }

    setStatus("sending");
    try {
      await api.post("/applications/", {
        name: name.trim(),
        phone: cleanPhone,
        comment: [kindNote, comment].filter(Boolean).join(". "),
        tariff: tariffId || null,
      });
      setStatus("done");
    } catch (error) {
      const backendPhoneError = error.response?.data?.phone;
      if (backendPhoneError) {
        setPhoneError(backendPhoneError[0]);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">×</button>

        {status === "done" ? (
          <div>
            <h2>Спасибо!</h2>
            <p>Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
            <button className="btn btn--blue" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2>{title}</h2>

            <label className="field">
              Имя
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label className="field">
              Телефон
              <input
                type="tel"
                inputMode="tel"
                maxLength={20}
                className={phoneError ? "invalid" : ""}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 900 123-45-67"
                required
              />
              {phoneError && <span className="field__error">{phoneError}</span>}
            </label>

            <label className="field">
              Тариф
              <select value={tariffId} onChange={(e) => setTariffId(e.target.value)}>
                <option value="">Пока не выбрал</option>
                {tariffs.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              Комментарий
              <span className="field__hint">
                Напишите социальную сеть и ваш юзернейм, чтобы нам было удобнее с вами связаться
              </span>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Например: Telegram @username"
              />
            </label>

            {status === "error" && (
              <p className="error-msg">Не получилось отправить. Проверьте данные и попробуйте ещё раз.</p>
            )}

            <button className="btn btn--navy btn--wide" disabled={status === "sending"}>
              {status === "sending" ? "Отправляем…" : "Отправить"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
