import Hero from "../components/hero/Hero";
import FlavorIndex from "../components/sections/FlavorIndex";
import Story from "../components/story/Story";
import Ingredients from "../components/ingredients/Ingredients";

export default function Home() {
  return (
    <>
      <Hero />
      <FlavorIndex />
      <Story />
      <Ingredients />
    </>
  );
}