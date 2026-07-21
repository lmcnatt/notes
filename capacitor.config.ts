import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mcnattcloud.notes",
  appName: "McNotes",
  // Local fallback assets. server.url below means the live site normally loads
  // directly; mobile-shell/index.html is only shown if the site is unreachable.
  webDir: "mobile-shell",
  server: {
    url: "https://notes.mcnattcloud.com",
    androidScheme: "https",
    allowNavigation: ["notes.mcnattcloud.com"],
  },
  android: { allowMixedContent: false },
};

export default config;
