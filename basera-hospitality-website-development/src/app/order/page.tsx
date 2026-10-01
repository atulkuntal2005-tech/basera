import type { Metadata } from "next";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import OrderCheckout from "@/components/OrderCheckout";

export const metadata: Metadata = {
  title: "Your Order",
  description: "Review your order and send it to Basera Restaurant & Hotel on WhatsApp or by email.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Order"
        title="Almost there. Send us your order."
        text="Check your dishes, add your details and send. We'll confirm with you directly."
        image={images.orderBanner}
        imageAlt="Pav bhaji thali (representative stock photo)"
      />
      <section className="mx-auto max-w-7xl px-4 py-14 pb-32 sm:px-6 lg:px-8">
        <OrderCheckout />
      </section>
    </>
  );
}
