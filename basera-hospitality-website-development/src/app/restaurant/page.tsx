import type { Metadata } from "next";
import Link from "next/link";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import Restaurant from "@/components/sections/Restaurant";
import CtaBand from "@/components/sections/CtaBand";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Vegetarian Restaurant in Mathura",
  description: "Vegetarian North Indian dining, Chinese, South Indian, snacks and beverages at Basera Restaurant & Hotel, Mathura.",
  alternates: { canonical: "/restaurant" },
};

export default function RestaurantPage() {
  return (
    <>
      <PageHero
        eyebrow="Restaurant"
        title="Vegetarian food, made for sharing."
        text="North Indian favourites, a few detours into Chinese and South Indian, and a comfortable room to enjoy it all in."
        image={images.restaurant}
        imageAlt="Warm restaurant dining interior (representative stock photo)"
      >
        <Link href="/menu" className="btn btn-gold">View Full Menu</Link>
        <WhatsAppButton topic="restaurant" variant="light">Chat on WhatsApp</WhatsAppButton>
      </PageHero>
      <Restaurant />
      <div className="pt-20">
        <CtaBand topic="restaurant" title="Hungry? Start an order." text="Choose your dishes on the menu page and send the order straight to us on WhatsApp or by email." />
      </div>
    </>
  );
}
