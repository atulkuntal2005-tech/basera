import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { waLink, waMessages } from "@/lib/whatsapp";

type Props = {
  /** Which pre-filled message to use (or pass `message` for a custom one). */
  topic?: keyof typeof waMessages;
  message?: string;
  children?: ReactNode;
  className?: string;
  variant?: "wa" | "light" | "outline" | "gold" | "dark";
  small?: boolean;
  icon?: boolean;
};

/** Every "chat on WhatsApp" style button on the site goes through here. */
export default function WhatsAppButton({
  topic = "general",
  message,
  children = "Chat on WhatsApp",
  className = "",
  variant = "wa",
  small = false,
  icon = true,
}: Props) {
  return (
    <a
      href={waLink(message ?? waMessages[topic])}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variant} ${small ? "btn-sm" : ""} ${className}`}
    >
      {icon && <WhatsAppIcon />}
      {children}
    </a>
  );
}
