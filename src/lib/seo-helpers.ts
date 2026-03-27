export function generateSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateSeoTitle(type: "service" | "neighborhood" | "post", name: string): string {
  switch (type) {
    case "service":
      return `${name} em Goiânia | Atendimento 24h`;
    case "neighborhood":
      return `Precisando de Desentupidora 24h no Setor ${name}?`;
    case "post":
      return name;
  }
}

export function generateMetaDescription(type: "service" | "neighborhood" | "post", name: string): string {
  switch (type) {
    case "service":
      return `Serviço profissional de ${name.toLowerCase()} em Goiânia e região. Atendimento 24 horas com garantia. Solicite orçamento grátis pelo WhatsApp.`;
    case "neighborhood":
      return `Desentupidora no Setor ${name} em Goiânia-GO. Atendimento rápido 24h. Desentupimento de pia, vaso, esgoto e mais. Orçamento grátis pelo WhatsApp.`;
    case "post":
      return `${name} - Dicas e informações sobre desentupimento.`;
  }
}

export function generateH1(type: "service" | "neighborhood" | "post", name: string): string {
  switch (type) {
    case "service":
      return name;
    case "neighborhood":
      return `Precisando de Desentupidora 24h no Setor ${name}?`;
    case "post":
      return name;
  }
}
