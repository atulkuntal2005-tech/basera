import type { Metadata } from "next";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import Hotel from "@/components/sections/Hotel";
import CtaBand from "@/components/sections/CtaBand";
import EnquiryModal from "@/components/EnquiryModal";

export const metadata: Metadata = {
  title: "Hotel & Rooms in Mathura",
  description: "AC rooms, parking and a vegetarian restaurant on site at Basera Restaurant & Hotel, NH-2 Delhi–Agra Bypass, Mathura.",
  alternates: { canonical: "/hotel" },
};

export default function HotelPage() {
  return (
    <>
      <PageHero
        eyebrow="Hotel"
        title="Rest easy on your Mathura trip."
        text="Comfortable AC rooms, parking and a restaurant on the premises."
        image={images.hotel}
        imageAlt="Hotel room with fresh white bedding (representative stock photo)"
      >
        <EnquiryModal kind="hotel" title="Enquire about rooms" intro="Share your dates and we'll get back to you about availability and rates." className="btn btn-gold">
          Enquire About Rooms
        </EnquiryModal>
      </PageHero>
      <Hotel />
      <CtaBand topic="hotel" title="Planning a stay? Let's sort your dates." text="Send us your check-in and check-out dates and we'll confirm what's available." />
    </>
  );
}
