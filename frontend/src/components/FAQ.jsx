import { useState } from "react";

export default function FAQ({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="faq" className="faq-section container">
      <h2 className="title title--navy">Часто задаваемые вопросы</h2>

      <div className="faq">
        {items.map((item) => (
          <div key={item.id}>
            <button
              className="faq__question"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              {item.question}
            </button>

            {openId === item.id && (
              <div className="faq__answer">
                {item.answer.split("\n\n").map((paragraph, i) => (
                  <p key={i} className={i === 0 ? "faq__lead" : ""}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
