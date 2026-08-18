import { Hero } from "../components/Hero";
import { Carousel } from "../components/Carousel";
import { ContactForm } from "../components/ContactForm";

export function Home() {
  return (
    <main id="topo">
      <Hero />
      <Carousel />
      <ContactForm />
    </main>
  );
}
