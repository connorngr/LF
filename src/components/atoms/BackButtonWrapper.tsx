"use client";

import { useRouter } from "next/navigation";

type BackButtonWrapperProps = Readonly<{
  href?: string;
  className?: string;
  children: React.ReactNode;
}>;

export function BackButtonWrapper({
  href = "/",
  className,
  children,
}: BackButtonWrapperProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        router.push(href, { scroll: false });
      }}
    >
      {children}
    </button>
  );
}
