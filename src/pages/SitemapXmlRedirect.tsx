import { useEffect, useState } from "react";

export default function SitemapXmlRedirect() {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "ntpwjzrhpmkuhzvmwaeg";
    fetch(`https://${projectId}.supabase.co/functions/v1/sitemap`)
      .then((res) => res.text())
      .then((text) => {
        setXml(text);
        // Replace the entire document with the XML content
        document.open("text/xml");
        document.write(text);
        document.close();
      })
      .catch(console.error);
  }, []);

  if (!xml) return null;
  return null;
}
