// Всплывающая форма заявки. Отправляет данные на бэкенд: POST /api/applications/.
// Менеджер потом видит заявку в админке Django (раздел «Заявки»).
import { useState } from "react";
import api from "../api/client";

// Проверяет номер телефона. Возвращает номер в виде +79001234567
// или null, если введено что-то не похожее на номер.
function normalizePhone(raw) {
  const text = raw.trim();
  // 1. В номере допустимы только цифры, пробелы, скобки, плюс и дефис
  if (!/^[\d\s()+-]+$/.test(text)) return null;
  const digits = text.replace(/\D/g, ""); // оставляем одни цифры
  // 2. Российский номер: 11 цифр, начинается с 7 или 8
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) return "+7" + digits.slice(1);
  // 3. Номер без кода страны: 10 цифр, начинается с 9
  if (digits.length === 10 && digits[0] === "9") return "+7" + digits;
  // 4. Международный номер: начинается с «+», от 10 до 15 цифр
  if (text.startsWith("+") && digits.length >= 10 && digits.length <= 15) return "+" + digits;
  return null;
}

export default function ApplicationModal({ tariffs, initialTariff, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [tariffId, setTariffId] = useState(initialTariff ? initialTariff.id : "");
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  // При вводе сразу убираем буквы и лишние символы
  function handlePhoneChange(event) {
    setPhone(event.target.value.replace(/[^\d\s()+-]/g, ""));
    setPhoneError("");
  }

  async function handleSubmit(event) {
    event.preventDefault(); // не перезагружать страницу

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      setPhoneError("Введите номер телефона, например +7 900 123-45-67");
      return; // не отправляем, пока номер неверный
    }

    setStatus("sending");
    try {
      await api.post("/applications/", {
        name: name.trim(),
        phone: cleanPhone,
        comment,
        tariff: tariffId || null,
      });
      setStatus("done");
    } catch (error) {
      // Если бэкенд тоже не принял номер, показываем его сообщение
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
      {/* stopPropagation: клик внутри окна не должен его закрывать */}
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
            <h2>Занять место</h2>

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
