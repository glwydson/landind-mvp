const contactLinks = [
  {
    label: "Lorem ipsum",
    href: "https://instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.5.2-1.9.4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.4-.3.8-.4 1.9-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.5.4 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.2.8.3 1.9.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.5-.2 1.9-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.4.3-.8.4-1.9.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.5-.4-1.9-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.2-.8-.3-1.9-.4-1.3-.1-1.7-.1-4.8-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z" />
      </svg>
    ),
  },
  {
    label: "Dolor sit",
    href: "https://wa.me/5511999999999",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2zm5.6 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.7 1.8.8 1.9c.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.1z" />
      </svg>
    ),
  },
  {
    label: "Amet",
    href: "mailto:contato@exemplo.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 .5v.7l8 5 8-5v-.7H4zm0 2.2v11.3h16V7.7l-8 5-8-5z" />
      </svg>
    ),
  },
];

const education = [
  "Lorem ipsum dolor sit amet — Consectetur",
  "Adipiscing elit sed do eiusmod — Tempor",
  "Incididunt ut labore et dolore magna aliqua",
];

const experience = [
  "Lorem ipsum — Dolor sit (2021–atual)",
  "Consectetur adipiscing — Elit sed (2018–2021)",
  "Eiusmod tempor — Incididunt ut (2016–2018)",
];

export function About() {
  return (
    <main className="about">
      <div className="container about__grid">
        <aside className="about__media">
          <img src="img6.svg" alt="Lorem ipsum dolor" className="about__avatar" />
        </aside>

        <section className="about__content">
          <p className="eyebrow">Lorem ipsum dolor</p>
          <h1>Lorem Ipsum</h1>
          <p className="about__role">Consectetur adipiscing</p>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
          </p>

          <h2>Lorem ipsum</h2>
          <ul className="about__list">
            {education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>Dolor sit amet</h2>
          <ul className="about__list">
            {experience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>Consectetur</h2>
          <ul className="about__contacts">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="about__contact"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="about__contact-icon">{link.icon}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
