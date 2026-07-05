import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function Container<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...rest
}: ContainerProps<T>) {
  const Tag = (as || "div") as ElementType;
  return (
    <Tag className={`container mx-auto ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
