import type { ReactNode } from "react";
import type { ImageRef } from "@/data/business";
import Photo from "@/components/Photo";

type Props = {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  image: ImageRef;
  imageAlt: string;
  children?: ReactNode;
};

/** Dark photographic banner used at the top of every inner page. */
export default function PageHero({ eyebrow, title, text, image, imageAlt, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-espresso">
      <div className="absolute inset-0 -z-10">
        <div className="kenburns h-full w-full">
          <Photo image={image} alt={imageAlt} priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/85 via-espresso/70 to-espresso/90" />
        <div className="jaali absolute inset-0 opacity-60" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pb-24 sm:pt-44 lg:px-8">
        <p className="eyebrow rise flex items-center gap-3 !text-gold-soft">
          <span className="h-px w-8 bg-gold-soft/60" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="rise mt-4 max-w-3xl text-[2.6rem] font-medium leading-[1.05] text-cream sm:text-6xl" style={{ animationDelay: "0.1s" }}>
          {title}
        </h1>
        {text && (
          <p className="rise mt-5 max-w-xl text-lg leading-relaxed text-cream/80" style={{ animationDelay: "0.2s" }}>
            {text}
          </p>
        )}
        {children && (
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
