export const SITE_CONFIG = {
  name: "Desentupidora Goiânia",
  phone: "(62) 99999-9999",
  phoneRaw: "5562999999999",
  whatsapp: "5562999999999",
  whatsappMessage: "Olá! Preciso de um serviço de desentupimento. Podem me ajudar?",
  address: "Goiânia, GO",
  hours: "24 horas - 7 dias por semana",
  domain: "www.desentupidoraemgoiania24h.com.br",
};

export function getWhatsAppUrl(message?: string) {
  const msg = encodeURIComponent(message || SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${msg}`;
}

export function getPhoneUrl() {
  return `tel:+${SITE_CONFIG.phoneRaw}`;
}

export interface Service {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  problems: string[];
  benefits: string[];
  faq: { question: string; answer: string }[];
}

export interface City {
  name: string;
  slug: string;
  state: string;
  neighborhoods: Neighborhood[];
}

export interface Neighborhood {
  name: string;
  slug: string;
  citySlug: string;
}

export const services: Service[] = [
  {
    name: "Desentupimento de Pia",
    slug: "desentupimento-de-pia",
    shortDescription: "Desentupimento rápido de pias de cozinha e banheiro.",
    description: "Serviço profissional de desentupimento de pia com equipamentos modernos. Resolvemos obstruções causadas por gordura, restos de alimentos e acúmulo de resíduos.",
    icon: "🚰",
    problems: ["Água não escoa", "Mau cheiro na pia", "Transbordamento", "Gordura acumulada"],
    benefits: ["Atendimento em até 30 minutos", "Sem quebrar pisos ou paredes", "Garantia no serviço", "Preço justo e sem surpresas"],
    faq: [
      { question: "Quanto custa desentupir uma pia?", answer: "O valor varia conforme a complexidade. Fazemos orçamento gratuito pelo WhatsApp." },
      { question: "Vocês atendem de madrugada?", answer: "Sim! Nosso atendimento é 24 horas, incluindo feriados." },
    ],
  },
  {
    name: "Desentupimento de Vaso Sanitário",
    slug: "desentupimento-de-vaso-sanitario",
    shortDescription: "Resolva o entupimento do vaso sanitário rapidamente.",
    description: "Desentupimento de vaso sanitário com técnica e equipamentos adequados. Sem sujeira e sem quebra.",
    icon: "🚽",
    problems: ["Vaso não dá descarga", "Água sobe ao dar descarga", "Objetos caídos no vaso", "Entupimento recorrente"],
    benefits: ["Solução definitiva", "Sem danos ao vaso", "Higienização completa", "Atendimento emergencial"],
    faq: [
      { question: "Vocês conseguem retirar objetos do vaso?", answer: "Sim, temos equipamentos específicos para remoção de objetos." },
      { question: "Quanto tempo demora o serviço?", answer: "Em média, 30 a 60 minutos dependendo do caso." },
    ],
  },
  {
    name: "Desentupimento de Esgoto",
    slug: "desentupimento-de-esgoto",
    shortDescription: "Desobstrução completa da rede de esgoto.",
    description: "Serviço completo de desentupimento de rede de esgoto residencial e comercial. Utilizamos equipamentos de hidrojateamento para limpeza total.",
    icon: "🔧",
    problems: ["Esgoto retornando", "Mau cheiro forte", "Ralos transbordando", "Rede coletora obstruída"],
    benefits: ["Hidrojateamento de alta pressão", "Câmera de inspeção", "Relatório técnico", "Garantia estendida"],
    faq: [
      { question: "O hidrojateamento danifica a tubulação?", answer: "Não, o hidrojateamento é seguro e indicado para todos os tipos de tubulação." },
      { question: "Atendem condomínios?", answer: "Sim, atendemos residências, condomínios e estabelecimentos comerciais." },
    ],
  },
  {
    name: "Desentupimento de Ralo",
    slug: "desentupimento-de-ralo",
    shortDescription: "Desentupimento de ralos de banheiro, área de serviço e garagem.",
    description: "Resolva entupimentos de ralos com rapidez. Atendemos ralos de banheiro, cozinha, área de serviço e garagem.",
    icon: "🕳️",
    problems: ["Água empoçando", "Ralo com mau cheiro", "Ralo borbulhando", "Lentidão no escoamento"],
    benefits: ["Diagnóstico preciso", "Limpeza completa", "Sem obras", "Orçamento gratuito"],
    faq: [
      { question: "Por que meu ralo está entupido?", answer: "Cabelos, sabão e pequenos objetos são as causas mais comuns." },
    ],
  },
  {
    name: "Desentupimento de Caixa de Gordura",
    slug: "desentupimento-de-caixa-de-gordura",
    shortDescription: "Limpeza e desentupimento de caixa de gordura.",
    description: "Manutenção preventiva e corretiva de caixa de gordura. Evite entupimentos graves com limpeza periódica.",
    icon: "🛢️",
    problems: ["Gordura transbordando", "Mau cheiro na cozinha", "Pia entupindo com frequência", "Caixa cheia"],
    benefits: ["Limpeza completa", "Descarte adequado de resíduos", "Manutenção preventiva", "Certificado de limpeza"],
    faq: [
      { question: "Com que frequência devo limpar a caixa de gordura?", answer: "Recomendamos a cada 3 a 6 meses, dependendo do uso." },
    ],
  },
  {
    name: "Limpa Fossa",
    slug: "limpa-fossa",
    shortDescription: "Serviço de limpeza e esgotamento de fossa séptica.",
    description: "Limpeza profissional de fossa séptica com caminhão limpa-fossa. Atendimento rápido e descarte ambientalmente correto.",
    icon: "🚛",
    problems: ["Fossa cheia", "Transbordamento", "Mau cheiro no quintal", "Solo encharcado"],
    benefits: ["Caminhão equipado", "Descarte legal", "Atendimento rápido", "Emissão de certificado"],
    faq: [
      { question: "Quando devo limpar a fossa?", answer: "Geralmente a cada 1 a 2 anos, dependendo do tamanho e número de moradores." },
    ],
  },
];

export const cities: City[] = [
  {
    name: "Goiânia",
    slug: "goiania",
    state: "GO",
    neighborhoods: [
      { name: "Setor Bueno", slug: "setor-bueno", citySlug: "goiania" },
      { name: "Setor Marista", slug: "setor-marista", citySlug: "goiania" },
      { name: "Jardim Goiás", slug: "jardim-goias", citySlug: "goiania" },
      { name: "Setor Oeste", slug: "setor-oeste", citySlug: "goiania" },
      { name: "Setor Central", slug: "setor-central", citySlug: "goiania" },
      { name: "Jardim América", slug: "jardim-america", citySlug: "goiania" },
      { name: "Setor Universitário", slug: "setor-universitario", citySlug: "goiania" },
      { name: "Setor Pedro Ludovico", slug: "setor-pedro-ludovico", citySlug: "goiania" },
      { name: "Vila Nova", slug: "vila-nova", citySlug: "goiania" },
      { name: "Setor Campinas", slug: "setor-campinas", citySlug: "goiania" },
    ],
  },
  {
    name: "Aparecida de Goiânia",
    slug: "aparecida-de-goiania",
    state: "GO",
    neighborhoods: [
      { name: "Cidade Vera Cruz", slug: "cidade-vera-cruz", citySlug: "aparecida-de-goiania" },
      { name: "Jardim Riviera", slug: "jardim-riviera", citySlug: "aparecida-de-goiania" },
      { name: "Vila Brasília", slug: "vila-brasilia", citySlug: "aparecida-de-goiania" },
      { name: "Setor dos Afonsos", slug: "setor-dos-afonsos", citySlug: "aparecida-de-goiania" },
    ],
  },
  {
    name: "Anápolis",
    slug: "anapolis",
    state: "GO",
    neighborhoods: [
      { name: "Jundiaí", slug: "jundiai", citySlug: "anapolis" },
      { name: "Centro", slug: "centro", citySlug: "anapolis" },
      { name: "Vila Jaiara", slug: "vila-jaiara", citySlug: "anapolis" },
    ],
  },
  {
    name: "Senador Canedo",
    slug: "senador-canedo",
    state: "GO",
    neighborhoods: [
      { name: "Jardim das Oliveiras", slug: "jardim-das-oliveiras", citySlug: "senador-canedo" },
      { name: "Residencial Canadá", slug: "residencial-canada", citySlug: "senador-canedo" },
    ],
  },
  {
    name: "Trindade",
    slug: "trindade",
    state: "GO",
    neighborhoods: [
      { name: "Setor Maysa", slug: "setor-maysa", citySlug: "trindade" },
      { name: "Jardim Marista", slug: "jardim-marista", citySlug: "trindade" },
    ],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getNeighborhoodBySlug(citySlug: string, neighborhoodSlug: string) {
  const city = getCityBySlug(citySlug);
  if (!city) return undefined;
  const neighborhood = city.neighborhoods.find((n) => n.slug === neighborhoodSlug);
  return neighborhood ? { neighborhood, city } : undefined;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function generateCityContent(cityName: string) {
  return {
    title: `Desentupidora em ${cityName} | Atendimento Rápido 24h`,
    metaDescription: `Desentupidora em ${cityName} com atendimento rápido 24h. Serviços de desentupimento de pia, vaso, esgoto e mais. Ligue agora ou fale no WhatsApp.`,
    h1: `Desentupidora em ${cityName}`,
    intro: `Procurando uma desentupidora em ${cityName}? Conte com atendimento rápido, profissional e disponível 24 horas por dia. Nossa equipe está pronta para resolver qualquer tipo de entupimento com agilidade e segurança.`,
    whyUs: `Somos referência em desentupimento em ${cityName}. Com equipamentos modernos e técnicos experientes, garantimos a solução mais rápida e eficiente para o seu problema.`,
  };
}

export function generateNeighborhoodContent(neighborhoodName: string, cityName: string) {
  return {
    title: `Desentupidora no ${neighborhoodName}, ${cityName} | Atendimento Imediato`,
    metaDescription: `Desentupidora no ${neighborhoodName} em ${cityName}. Atendimento rápido e profissional. Desentupimento de pia, vaso, esgoto e mais. Fale no WhatsApp.`,
    h1: `Desentupidora no ${neighborhoodName}`,
    intro: `Atendemos diariamente o bairro ${neighborhoodName} em ${cityName}, oferecendo soluções rápidas e profissionais para problemas de entupimento. Nossa equipe chega em minutos!`,
    responseTime: "Tempo estimado de chegada: 20 a 40 minutos",
  };
}

export function generateServiceContent(serviceName: string) {
  return {
    title: `${serviceName} em Goiânia | Atendimento 24h`,
    metaDescription: `Serviço profissional de ${serviceName.toLowerCase()} em Goiânia e região. Atendimento 24 horas com garantia. Solicite orçamento grátis pelo WhatsApp.`,
    h1: serviceName,
  };
}
