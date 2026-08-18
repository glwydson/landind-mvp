import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

const AUTO_PLAY_MS = 5000;
const SWIPE_RATIO = 0.22;
const SWIPE_VELOCITY = 0.35;

export function Carousel() {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityRef = useRef(0);
  const axisLockRef = useRef<"x" | "y" | null>(null);
  const widthRef = useRef(0);
  const indexRef = useRef(0);

  indexRef.current = index;

  const goTo = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
    setOffset(0);
  }, []);

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    if (paused || dragging) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
      setOffset(0);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, dragging, index]);

  const measure = () => {
    widthRef.current = viewportRef.current?.clientWidth ?? 0;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    measure();
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    lastXRef.current = event.clientX;
    lastTRef.current = event.timeStamp;
    velocityRef.current = 0;
    axisLockRef.current = null;
    setPaused(true);
    setDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startXRef.current;
    const dy = event.clientY - startYRef.current;

    if (axisLockRef.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axisLockRef.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (axisLockRef.current === "y") {
        pointerIdRef.current = null;
        setDragging(false);
        setOffset(0);
        window.setTimeout(() => setPaused(false), 400);
        return;
      }
    }

    if (axisLockRef.current !== "x") return;

    event.preventDefault();

    const dt = Math.max(event.timeStamp - lastTRef.current, 1);
    velocityRef.current = (event.clientX - lastXRef.current) / dt;
    lastXRef.current = event.clientX;
    lastTRef.current = event.timeStamp;

    const atStart = indexRef.current === 0 && dx > 0;
    const atEnd = indexRef.current === slides.length - 1 && dx < 0;
    const resistance = atStart || atEnd ? 0.35 : 1;
    setOffset(dx * resistance);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    pointerIdRef.current = null;

    const width = widthRef.current || 1;
    const dx = offset;
    const velocity = velocityRef.current;
    const passed =
      Math.abs(dx) > width * SWIPE_RATIO || Math.abs(velocity) > SWIPE_VELOCITY;

    setDragging(false);

    if (passed && axisLockRef.current === "x") {
      if (dx < 0 || velocity < -SWIPE_VELOCITY) next();
      else prev();
    } else {
      setOffset(0);
    }

    axisLockRef.current = null;
    window.setTimeout(() => setPaused(false), 1400);
  };

  const trackStyle: CSSProperties = {
    transform: `translate3d(calc(${-index * 100}% + ${offset}px), 0, 0)`,
    transition: dragging ? "none" : "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
  };

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

          <div
            ref={viewportRef}
            className={`carousel__viewport${dragging ? " carousel__viewport--dragging" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          >
            <div ref={trackRef} className="carousel__track" style={trackStyle}>
              {slides.map((slide, i) => (
                <article
                  key={slide.title}
                  className="carousel__slide"
                  data-active={i === index}
                  aria-hidden={i !== index}
                >
                  <div className="carousel__media">
                    <img src={slide.image} alt={slide.title} draggable={false} />
                  </div>
                  <div className="carousel__body">
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                </article>
              ))}
            </div>
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

          <p className="carousel__hint">Deslize para ver mais</p>
        </div>
      </div>
    </section>
  );
}
