import Script from "next/script";
import { getUmamiConfig, isUmamiEnabled } from "@/lib/analytics/config";

const BEFORE_SEND_SCRIPT = `
window.umamiBeforeSendHandler = function (_type, payload) {
  var path = payload && (payload.urlPath || payload.url);
  if (!path) return payload;
  if (path.indexOf('/upload') === 0 || path.indexOf('/auth') === 0) {
    return false;
  }
  return payload;
};
`;

export function UmamiScript() {
  if (!isUmamiEnabled()) return null;

  const config = getUmamiConfig();
  if (!config) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BEFORE_SEND_SCRIPT }} />
      <Script
        defer
        src={config.scriptUrl}
        data-website-id={config.websiteId}
        data-before-send="umamiBeforeSendHandler"
        strategy="afterInteractive"
      />
    </>
  );
}
