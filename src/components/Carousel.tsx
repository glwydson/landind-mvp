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

const TOTAL = slides.length;
const trackSlides: Slide[] = [slides[TOTAL - 1], ...slides, slides[0]];

const AUTO_PLAY_MS = 6500;
const SLIDE_MS_DESKTOP = 1700;
const SLIDE_MS_MOBILE = 2200;
const SWIPE_RATIO = 0.18;
const SWIPE_VELOCITY = 0.28;
const EASE_DESKTOP = "cubic-bezier(0.33, 0.08, 0.18, 1)";
const EASE_MOBILE = "cubic-bezier(0.25, 0.08, 0.15, 1)";

function useIsTouchLayout() {
  const [touch, setTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 719px), (pointer: coarse)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 719px), (pointer: coarse)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return touch;
}

export function Carousel() {
  const [pos, setPos] = useState(1);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);

  const isTouchLayout = useIsTouchLayout();
  const slideMs = isTouchLayout ? SLIDE_MS_MOBILE : SLIDE_MS_DESKTOP;
  const slideEase = isTouchLayout ? EASE_MOBILE : EASE_DESKTOP;

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
  const offsetRef = useRef(0);
  const animatingRef = useRef(false);
  const pausedRef = useRef(false);
  const animTimerRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const slideMsRef = useRef(slideMs);

  posRef.current = pos;
  offsetRef.current = offset;
  slideMsRef.current = slideMs;

  const realIndex = ((pos - 1) % TOTAL + TOTAL) % TOTAL;

  const clearAnimTimer = () => {
    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  };

  const clearAutoTimer = () => {
    if (autoTimerRef.current !== null) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const clearResumeTimer = () => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const normalizePos = useCallback((current: number) => {
    if (current >= TOTAL + 1) {
      setNoTransition(true);
      setPos(1);
      posRef.current = 1;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false));
      });
      return 1;
    }
    if (current <= 0) {
      setNoTransition(true);
      setPos(TOTAL);
      posRef.current = TOTAL;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false));
      });
      return TOTAL;
    }
    return current;
  }, []);

  const finishAnimation = useCallback(() => {
    clearAnimTimer();
    animatingRef.current = false;
    normalizePos(posRef.current);
  }, [normalizePos]);

  const slideTo = useCallback(
    (nextPos: number) => {
      if (animatingRef.current) return;

      setOffset(0);
      offsetRef.current = 0;
      animatingRef.current = true;
      setPos(nextPos);
      posRef.current = nextPos;

      clearAnimTimer();
      animTimerRef.current = window.setTimeout(
        finishAnimation,
        slideMsRef.current + 80,
      );
    },
    [finishAnimation],
  );

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

  const startAutoplay = useCallback(() => {
    clearAutoTimer();
    if (pausedRef.current) return;
    autoTimerRef.current = window.setInterval(() => {
      if (pausedRef.current || animatingRef.current || pointerIdRef.current !== null) {
        return;
      }
      next();
    }, AUTO_PLAY_MS);
  }, [next]);

  const pauseAutoplay = useCallback((resumeAfterMs = 2000) => {
    pausedRef.current = true;
    clearAutoTimer();
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      startAutoplay();
    }, resumeAfterMs);
  }, [startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => {
      clearAutoTimer();
      clearAnimTimer();
      clearResumeTimer();
    };
  }, [startAutoplay]);

  const measure = () => {
    widthRef.current = viewportRef.current?.clientWidth ?? 0;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    // Se ainda anima, cancela e aceita o novo gesto
    if (animatingRef.current) {
      clearAnimTimer();
      animatingRef.current = false;
      normalizePos(posRef.current);
    }

    measure();
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    lastXRef.current = event.clientX;
    lastTRef.current = event.timeStamp;
    velocityRef.current = 0;
    axisLockRef.current = null;
    setOffset(0);
    offsetRef.current = 0;
    setDragging(true);
    pauseAutoplay(2500);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startXRef.current;
    const dy = event.clientY - startYRef.current;

    if (axisLockRef.current === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axisLockRef.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (axisLockRef.current === "y") {
        pointerIdRef.current = null;
        setDragging(false);
        setOffset(0);
        offsetRef.current = 0;
        return;
      }
    }

    if (axisLockRef.current !== "x") return;
    event.preventDefault();

    const dt = Math.max(event.timeStamp - lastTRef.current, 1);
    velocityRef.current = (event.clientX - lastXRef.current) / dt;
    lastXRef.current = event.clientX;
    lastTRef.current = event.timeStamp;

    offsetRef.current = dx;
    setOffset(dx);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    pointerIdRef.current = null;

    const width = widthRef.current || 1;
    const dx = offsetRef.current;
    const velocity = velocityRef.current;
    const lockedAxis = axisLockRef.current;
    axisLockRef.current = null;
    setDragging(false);

    const passed =
      lockedAxis === "x" &&
      (Math.abs(dx) > width * SWIPE_RATIO || Math.abs(velocity) > SWIPE_VELOCITY);

    if (passed) {
      if (dx < 0 || velocity < -SWIPE_VELOCITY) next();
      else prev();
    } else {
      setOffset(0);
      offsetRef.current = 0;
    }

    pauseAutoplay(2500);
  };

  const trackStyle: CSSProperties = {
    transform: `translate3d(calc(${-pos * 100}% + ${offset}px), 0, 0)`,
    transition:
      dragging || noTransition
        ? "none"
        : `transform ${slideMs}ms ${slideEase}`,
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
              pauseAutoplay(2500);
              prev();
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
            <div className="carousel__track" style={trackStyle}>
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
              pauseAutoplay(2500);
              next();
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
                  pauseAutoplay(2500);
                  goToReal(i);
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
