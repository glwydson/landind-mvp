import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent,
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

const TOTAL = slides.length;
/** [clone último, ...slides, clone primeiro] para loop infinito com slide */
const trackSlides: Slide[] = [slides[TOTAL - 1], ...slides, slides[0]];

const AUTO_PLAY_MS = 6500;
const SLIDE_MS = 1100;
const SWIPE_RATIO = 0.18;
const SWIPE_VELOCITY = 0.28;
const EASE = "cubic-bezier(0.33, 0.08, 0.18, 1)";


export function Carousel() {
  /** posição no track estendido (1 = primeiro slide real) */
  const [pos, setPos] = useState(1);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityRef = useRef(0);
  const axisLockRef = useRef<"x" | "y" | null>(null);
  const widthRef = useRef(0);
  const posRef = useRef(1);
  const animatingRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);

  posRef.current = pos;
  animatingRef.current = animating;

  const realIndex = ((pos - 1) % TOTAL + TOTAL) % TOTAL;

  const clearResume = () => {
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  const scheduleResume = (ms = 1600) => {
    clearResume();
    resumeTimer.current = window.setTimeout(() => setPaused(false), ms);
  };

  const jumpTo = useCallback((nextPos: number) => {
    setNoTransition(true);
    setPos(nextPos);
    setOffset(0);
    setAnimating(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNoTransition(false));
    });
  }, []);

  const slideTo = useCallback((nextPos: number) => {
    if (animatingRef.current) return;
    setOffset(0);
    setAnimating(true);
    setPos(nextPos);
  }, []);

  const next = useCallback(() => {
    slideTo(posRef.current + 1);
  }, [slideTo]);

  const prev = useCallback(() => {
    slideTo(posRef.current - 1);
  }, [slideTo]);

  const goToReal = useCallback(
    (real: number) => {
      const target = real + 1;
      if (target === posRef.current) return;
      slideTo(target);
    },
    [slideTo],
  );

  const onTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;

    setAnimating(false);
    const current = posRef.current;

    if (current >= TOTAL + 1) {
      jumpTo(1);
      return;
    }
    if (current <= 0) {
      jumpTo(TOTAL);
    }
  };

  useEffect(() => {
    if (paused || dragging || animating) return;
    const timer = window.setInterval(() => {
      next();
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, dragging, animating, next, pos]);

  useEffect(() => () => clearResume(), []);

  const measure = () => {
    widthRef.current = viewportRef.current?.clientWidth ?? 0;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (animatingRef.current) return;

    measure();
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    lastXRef.current = event.clientX;
    lastTRef.current = event.timeStamp;
    velocityRef.current = 0;
    axisLockRef.current = null;
    clearResume();
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
        scheduleResume(400);
        return;
      }
    }

    if (axisLockRef.current !== "x") return;
    event.preventDefault();

    const dt = Math.max(event.timeStamp - lastTRef.current, 1);
    velocityRef.current = (event.clientX - lastXRef.current) / dt;
    lastXRef.current = event.clientX;
    lastTRef.current = event.timeStamp;

    // resistência elástica nas bordas do track estendido (quase nunca)
    const resistance = 1;
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
    scheduleResume(1800);
  };

  const trackStyle: CSSProperties = {
    transform: `translate3d(calc(${-pos * 100}% + ${offset}px), 0, 0)`,
    transition:
      dragging || noTransition
        ? "none"
        : `transform ${SLIDE_MS}ms ${EASE}`,
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
            onClick={() => {
              setPaused(true);
              prev();
              scheduleResume(1800);
            }}
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
            <div
              className="carousel__track"
              style={trackStyle}
              onTransitionEnd={onTrackTransitionEnd}
            >
              {trackSlides.map((slide, i) => (
                <article
                  key={`${slide.title}-${i}`}
                  className="carousel__slide"
                  data-active={i === pos}
                  aria-hidden={i !== pos}
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
            onClick={() => {
              setPaused(true);
              next();
              scheduleResume(1800);
            }}
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
                data-active={i === realIndex}
                onClick={() => {
                  setPaused(true);
                  goToReal(i);
                  scheduleResume(1800);
                }}
                aria-label={`Ir para ${slide.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
