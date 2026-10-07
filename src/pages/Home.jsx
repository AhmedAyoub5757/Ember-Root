import Hero from "../components/hero/Hero";
import FlavorIndex from "../components/sections/FlavorIndex";
import Story from "../components/story/Story";
import Ingredients from "../components/ingredients/Ingredients";
import Letters from "../components/letters/Letters";
import Newsletter from "../components/newsletter/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FlavorIndex />
      <Story />
      <Ingredients />
      <Letters />
      <Newsletter />
    </>
  );
}