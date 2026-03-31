import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteData";

export default function GlobalScripts() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings?.global_scripts) return;

    const container = document.createElement("div");
    container.id = "global-scripts-container";

    // Remove previous injection
    const existing = document.getElementById("global-scripts-container");
    if (existing) existing.remove();

    // Parse and inject scripts
    const temp = document.createElement("div");
    temp.innerHTML = settings.global_scripts;

    const scripts = temp.querySelectorAll("script");
    const nonScripts = temp.querySelectorAll(":not(script)");

    // Add non-script elements (e.g. noscript, img pixels)
    nonScripts.forEach((el) => {
      container.appendChild(el.cloneNode(true));
    });

    document.head.appendChild(container);

    // Scripts need to be re-created to execute
    scripts.forEach((orig) => {
      const script = document.createElement("script");
      // Copy attributes
      Array.from(orig.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });
      // Copy inline content
      if (orig.textContent) {
        script.textContent = orig.textContent;
      }
      document.head.appendChild(script);
    });

    return () => {
      const el = document.getElementById("global-scripts-container");
      if (el) el.remove();
    };
  }, [settings?.global_scripts]);

  return null;
}
