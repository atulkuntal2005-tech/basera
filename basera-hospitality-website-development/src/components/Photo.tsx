import type { ImageRef } from "@/data/business";

const WIDTHS = [480, 800, 1200, 1600];

export function pexelsUrl(id: number, w: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

type Props = {
  image: ImageRef;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * One component for every photo on the site.
 * Real photos: pass { src: "/photos/xyz.jpg" }. Stock: pass { pexelsId }.
 */
export default function Photo({ image, alt, className = "", sizes = "100vw", priority = false }: Props) {
  const common = {
    alt,
    sizes,
    className: `h-full w-full object-cover ${className}`,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
  };
  if (image.src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image.src} {...common} />;
  }
  const id = image.pexelsId ?? 0;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pexelsUrl(id, 800)}
      srcSet={WIDTHS.map((w) => `${pexelsUrl(id, w)} ${w}w`).join(", ")}
      {...common}
    />
  );
}
