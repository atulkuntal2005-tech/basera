import type { Metadata } from "next";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import Gallery from "@/components/sections/Gallery";
import CtaBand from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Food, restaurant, hotel and event photography for Basera Restaurant & Hotel, Mathura.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Food, rooms and good occasions."
        text="Tap any photo to see it larger."
        image={images.restaurantSecondary}
        imageAlt="Indian flatbread and curry on a wooden plate (representative stock photo)"
      />
      <section className="py-16 sm:py-20" aria-label="Photo gallery">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Gallery />
        </div>
      </section>
      <CtaBand topic="general" />
    </>
  );
}
