import { useEffect } from "react";

export default function SitemapXmlRedirect() {
  useEffect(() => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "ntpwjzrhpmkuhzvmwaeg";
    window.location.href = `https://${projectId}.supabase.co/functions/v1/sitemap`;
  }, []);
  return null;
}
