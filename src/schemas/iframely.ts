import { z } from "zod";

const iframelyPlayerLinkSchema = z.object({
  href: z.url(),
});

export const iframelyResponseSchema = z.object({
  links: z.object({
    player: z.array(iframelyPlayerLinkSchema).min(1, "No SoundCloud player embed found"),
  }),
});

export type IframelyResponse = z.infer<typeof iframelyResponseSchema>;
