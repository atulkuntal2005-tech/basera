import type { Metadata } from "next";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import About from "@/components/sections/About";
import CtaBand from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About Basera",
  description: "Basera Restaurant & Hotel brings a vegetarian restaurant, hotel stays and banquet facilities together in Mathura.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Basera"
        title="A place that feels like home for a while."
        text="A restaurant, a hotel and a banquet space, all at one address on the Delhi–Agra Bypass."
        image={images.restaurantSecondary}
        imageAlt="Indian flatbread and curry on a wooden plate (representative stock photo)"
      />
      <About full />
      <CtaBand topic="general" />
    </>
  );
}
