import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
};

export default function SectionHeading({ eyebrow, title, text, align = "left", light = false, as: Tag = "h2", className = "" }: Props) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${light ? "!text-gold-soft" : ""}`}>
          <span className={`h-px w-8 ${light ? "bg-gold-soft/60" : "bg-gold-deep/50"}`} aria-hidden />
          {eyebrow}
        </p>
      )}
      <Tag className={`mt-4 text-[2.1rem] font-medium leading-[1.1] sm:text-5xl ${light ? "text-cream" : "text-espresso"}`}>{title}</Tag>
      {text && <p className={`mt-5 text-[1.05rem] leading-relaxed ${light ? "text-cream/75" : "text-cocoa"}`}>{text}</p>}
    </div>
  );
}
