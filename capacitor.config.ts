import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.yourapp",
  appName: "McNotes",
  // Local fallback assets. server.url below means the live site normally loads
  // directly; mobile-shell/index.html is only shown if the site is unreachable.
  webDir: "mobile-shell",
  server: {
    url: "https://YOUR-LIVE-URL.example",
    androidScheme: "https",
    allowNavigation: ["YOUR-LIVE-URL.example"],
  },
  android: { allowMixedContent: false },
};

export default config;
