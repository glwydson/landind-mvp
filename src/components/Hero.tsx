export function Hero() {
  return (
    <section className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: 'url("autismo.jpg")' }}
        aria-hidden="true"
      />
      <div className="hero__overlay">
        <div className="container hero__grid">
          <div className="hero__media">
            <img src="muie.png" alt="Lorem ipsum dolor sit amet" className="hero__image" />
          </div>
          <div className="hero__copy">
            <p className="eyebrow">Lorem ipsum dolor</p>
            <h1>Lorem ipsum dolor sit amet</h1>
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <div className="hero__actions">
              <a className="btn" href="#contato">
                Lorem ipsum
              </a>
              <a className="btn btn--ghost" href="#carrossel">
                Dolor sit amet
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
