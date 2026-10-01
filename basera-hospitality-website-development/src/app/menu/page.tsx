import type { Metadata } from "next";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import MenuBrowser from "@/components/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu & Order Online",
  description: "Browse the vegetarian menu at Basera Restaurant & Hotel, Mathura and send your order on WhatsApp or by email.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="The Menu"
        title="Pick what you feel like eating."
        text="Add dishes to your order, then send it to us on WhatsApp or by email."
        image={images.menuBanner}
        imageAlt="Paneer curry garnished with coriander (representative stock photo)"
      />
      <MenuBrowser />
    </>
  );
}
