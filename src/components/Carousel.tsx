import { useCallback, useEffect, useState } from "react";

type Slide = {
  image: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    image: "img2.jpg",
    title: "Lorem ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    image: "img3.jpg",
    title: "Dolor sit amet",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
  },
  {
    image: "img4.jpg",
    title: "Consectetur",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
];

const AUTO_PLAY_MS = 4000;

export function Carousel() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="carrossel" className="section">
      <div className="container">
        <div className="section__head">
          <h2>Lorem ipsum dolor</h2>
          <p>Sit amet, consectetur adipiscing elit sed do eiusmod tempor.</p>
        </div>

        <div className="carousel">
          <button
            type="button"
            className="carousel__arrow carousel__arrow--prev"
            onClick={prev}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="carousel__viewport">
            {slides.map((slide, i) => (
              <article
                key={slide.title}
                className="carousel__slide"
                data-active={i === index}
                aria-hidden={i !== index}
              >
                <div className="carousel__media">
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className="carousel__body">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="carousel__arrow carousel__arrow--next"
            onClick={next}
            aria-label="Próximo"
          >
            ›
          </button>

          <div className="carousel__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                className="carousel__dot"
                data-active={i === index}
                onClick={() => goTo(i)}
                aria-label={`Ir para ${slide.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
