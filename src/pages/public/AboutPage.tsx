import {
  Craftsmanship,
  CTA,
  Hero,
  Values,
} from "../../components/common/AboutPageComponent";

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <main className="grow">
        <Hero />
        <Values />
        <Craftsmanship />
        <CTA />
      </main>
    </div>
  );
}
export default AboutPage;
