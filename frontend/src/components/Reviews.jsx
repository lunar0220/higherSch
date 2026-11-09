export default function Reviews({ reviews }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="section container">
      <h2 className="title title--navy">Отзывы</h2>

      <div className="reviews">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <p>{review.text}</p>
            <p className="review__author">
              {review.author_name}
              {review.score && ` — ${review.score}`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
