export function getUmamiConfig(): { scriptUrl: string; websiteId: string } | null {
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!scriptUrl || !websiteId) return null;

  return { scriptUrl, websiteId };
}

export function isUmamiEnabled(): boolean {
  return process.env.NODE_ENV === "production" && getUmamiConfig() !== null;
}
