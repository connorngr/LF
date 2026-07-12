"use client";

import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";

type BackButtonWrapperProps = Readonly<{
  href?: string;
  className?: string;
  analyticsSlug?: string;
  children: React.ReactNode;
}>;

export function BackButtonWrapper({
  href = "/",
  className,
  analyticsSlug,
  children,
}: BackButtonWrapperProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (analyticsSlug) {
          trackEvent("back_to_gallery", { slug: analyticsSlug });
        }
        router.push(href, { scroll: false });
      }}
    >
      {children}
    </button>
  );
}
