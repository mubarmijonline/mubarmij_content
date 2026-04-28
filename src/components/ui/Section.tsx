import type { ReactNode } from "react";
import Container from "./Container";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  bg?: "white" | "light" | "navy" | "gradient";
  padded?: boolean;
};

const bgMap: Record<NonNullable<Props["bg"]>, string> = {
  white: "bg-white",
  light: "bg-bglight",
  navy: "bg-navy-deep text-white",
  gradient: "bg-hero-gradient text-white",
};

export default function Section({
  id,
  children,
  className = "",
  bg = "white",
  padded = true,
}: Props) {
  return (
    <section id={id} className={`${bgMap[bg]} ${padded ? "section" : ""} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
