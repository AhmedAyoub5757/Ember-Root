import Hero from "../components/hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="px-5 py-24 lg:px-8">
        <p className="label opacity-60">Next section goes here</p>
        <div className="h-[60vh]" />
      </section>
    </>
  );
}