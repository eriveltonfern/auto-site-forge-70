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

export function generateSeoTitle(type: "service" | "city" | "neighborhood" | "post", name: string, cityName?: string): string {
  switch (type) {
    case "service":
      return `${name} em Goiânia | Atendimento 24h`;
    case "city":
      return `Desentupidora em ${name} | Atendimento Rápido 24h`;
    case "neighborhood":
      return `Desentupidora no ${name}${cityName ? `, ${cityName}` : ""} | Atendimento Imediato`;
    case "post":
      return name;
  }
}

export function generateMetaDescription(type: "service" | "city" | "neighborhood" | "post", name: string, cityName?: string): string {
  switch (type) {
    case "service":
      return `Serviço profissional de ${name.toLowerCase()} em Goiânia e região. Atendimento 24 horas com garantia. Solicite orçamento grátis pelo WhatsApp.`;
    case "city":
      return `Desentupidora em ${name} com atendimento rápido 24h. Serviços de desentupimento de pia, vaso, esgoto e mais. Ligue agora ou fale no WhatsApp.`;
    case "neighborhood":
      return `Desentupidora no ${name}${cityName ? ` em ${cityName}` : ""}. Atendimento rápido e profissional. Fale no WhatsApp.`;
    case "post":
      return `${name} - Dicas e informações sobre desentupimento.`;
  }
}

export function generateH1(type: "service" | "city" | "neighborhood" | "post", name: string): string {
  switch (type) {
    case "service":
      return name;
    case "city":
      return `Desentupidora em ${name}`;
    case "neighborhood":
      return `Desentupidora no ${name}`;
    case "post":
      return name;
  }
}
