import { Link } from "react-router-dom";
import { Phone, MessageCircle, CheckCircle, Shield, ChevronDown, Award, Zap, CreditCard, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, getPhoneUrl, type DbSettings } from "@/hooks/useSiteData";
import { noNa } from "@/lib/preposition";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

/* ========== CTA BANNER ========== */
interface CtaBannerProps {
  settings: DbSettings;
  localName: string;
  heading?: string;
  variant?: 1 | 2;
}

export function CtaBanner({ settings, localName, heading, variant = 1 }: CtaBannerProps) {
  const h2 = heading || "Empresa de Desentupimento Perto de Mim";
  return (
    <section className="hero-bg py-10 md:py-14">
      <div className="container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
          {/* Mascot */}
          <div className="shrink-0">
            <img
              src="https://desentupidoras.goiania.br/wp-content/uploads/2025/07/desentupidor-300x300.png"
              alt="Desentupidor"
              className="h-40 w-40 object-contain md:h-52 md:w-52"
              loading="lazy"
            />
          </div>
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-3 text-2xl font-black text-primary-foreground md:text-3xl lg:text-4xl">
              {h2}
            </h2>
            <p className="text-base text-primary-foreground/90 leading-relaxed">
              Problemas com entupimento, vazamento ou retorno de esgoto? Desentupidora 24h resolve!
            </p>
            <p className="mt-1 text-base text-primary-foreground/80 leading-relaxed">
              {variant === 1
                ? `Atendimento rápido ${localName ? `no ${localName}` : "em Goiânia"} com equipe especializada e total segurança.`
                : `Serviço rápido ${localName ? `no ${localName}` : "em Goiânia"} com equipe especializada e total segurança.`}
            </p>
          </div>
          {/* Button */}
          <div className="shrink-0">
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== OUTROS SERVIÇOS ========== */
const otherServicesList = [
  "Limpeza de caixa de gordura",
  "Inspeção de tubulação com câmera",
  "Localização de obstruções invisíveis",
  "Desentupimento de coluna de prédio",
  "Manutenção preventiva de encanamentos",
  "Desentupimento industrial com alta pressão",
  "Solução para retorno de esgoto em calhas e quintais",
  "Controle de odores em redes de esgoto",
];

export function OutrosServicos({ companyName }: { companyName: string }) {
  return (
    <section className="section-alt py-16 md:py-20">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <h2 className="mb-4 text-2xl font-black text-foreground md:text-3xl">
              Outros serviços da Desentupidora em Goiânia
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed">
              Além dos desentupimentos tradicionais, a <strong className="text-foreground">{companyName}</strong> realiza serviços especializados com agilidade e segurança, como:
            </p>
            <ul className="space-y-3">
              {otherServicesList.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Todos os atendimentos são feitos com <strong className="text-foreground">equipamentos modernos</strong>, por <strong className="text-foreground">técnicos especializados</strong>, oferecendo <strong className="text-foreground">diagnóstico preciso</strong> e solução eficaz no menor tempo possível.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="flex justify-center">
            <img src="https://desentupidoras.goiania.br/wp-content/uploads/2025/07/desentupidor-1.png" alt="Desentupidor profissional" className="max-h-96 w-auto object-contain" loading="lazy" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ========== VANTAGENS ========== */
const advantagesList = [
  { icon: Zap, title: "Atendimento Imediato", desc: "Chegamos rápido em todo a região com técnicos preparados para resolver na hora." },
  { icon: Shield, title: "Segurança e profissionalismo", desc: "Nossa equipe é treinada para executar o serviço com total atenção e segurança." },
  { icon: CheckCircle, title: "Sem Quebra de Piso", desc: "Usamos tecnologia que desentope sem necessidade de quebrar azulejos ou pisos." },
  { icon: Award, title: "Garantia no serviço", desc: "Serviços com garantia e suporte caso ocorra qualquer imprevisto." },
  { icon: CreditCard, title: "Pagamento facilitado", desc: "Aceitamos Pix, cartões de crédito e débito para sua maior comodidade." },
];

export function Vantagens({ serviceName }: { serviceName?: string }) {
  const label = serviceName ? serviceName.toLowerCase() : "desentupimento";
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">
            Vantagens de contratar serviço de {label} próximo a mim
          </h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantagesList.map((a, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-accent/50 hover:-translate-y-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                <a.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== POR QUE ESCOLHER ========== */
export function PorQueEscolher({ localName, companyName }: { localName: string; companyName: string }) {
  return (
    <section className="section-alt py-16 md:py-20">
      <div className="container">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
            Por que escolher o Desentupidora 24 horas {localName ? `no ${localName}` : "Goiânia"}?
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Precisando de uma <strong className="text-foreground">empresa desentupidora com preço justo e serviço rápido</strong>? Atendemos {localName ? `no ${localName}` : "toda Goiânia"} com soluções eficientes, sem quebra e com garantia.
          </p>
          <p className="mb-4 text-foreground font-bold">
            Elimine entupimentos com a desentupidora mais próxima de você!
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Somos especialistas em desentupimento de esgoto, pia, vaso sanitário, ralo e fossa. Atendemos residências, comércios e indústrias com equipamentos modernos.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A <strong className="text-foreground">{companyName}</strong> está sempre por perto, pronta para agir com agilidade, segurança e profissionais capacitados. Atendimento imediato no WhatsApp!
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ========== FAQ — reference style: simple h3 + p stacked, no accordion ========== */
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ faqs }: { faqs: FaqItem[]; openFaq?: number | null; setOpenFaq?: (v: number | null) => void }) {
  return (
    <section className="py-16 md:py-20 section-alt">
      <div className="container mx-auto max-w-3xl">
        <motion.div {...fadeUp} className="mb-10 text-center">
          <h2 className="text-2xl font-black text-foreground md:text-4xl">Perguntas frequentes</h2>
        </motion.div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.03 }}>
              <h3 className="mb-2 text-lg font-bold text-foreground md:text-xl">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              {i < faqs.length - 1 && <hr className="mt-6 border-border" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== DEPOIMENTOS ========== */
const testimonialsList = [
  { name: "Patrícia Gomes", text: "Meu vaso entupiu no fim de semana e fui atendida em menos de 40 minutos. Serviço limpo, rápido e com preço justo!" },
  { name: "Rodrigo Silva", text: "Chamei para desentupir o esgoto da casa da minha mãe. Atendimento excelente, técnico educado e resolveu na hora." },
  { name: "Camila Duarte", text: "A pia da cozinha estava transbordando. Vieram no mesmo dia e deixaram tudo funcionando. Recomendo muito a empresa!" },
];

export function Depoimentos() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Depoimentos de clientes em Goiânia-GO</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonialsList.map((t, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-sm text-muted-foreground italic leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== CONTATO + GOOGLE MAPS ========== */
export function ContatoSection({ settings, whatsappUrl }: { settings: DbSettings; whatsappUrl?: string }) {
  const wa = whatsappUrl || getWhatsAppUrl(settings);
  return (
    <section className="section-alt py-16 md:py-20">
      <div className="container">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-black text-foreground md:text-4xl">Entre em contato</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <div className="grid w-full gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <Phone className="mx-auto mb-2 h-6 w-6 text-accent lg:mx-0" />
                  <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                  <a href={getPhoneUrl(settings)} className="font-display text-lg font-bold text-accent hover:underline">
                    {settings.phone}
                  </a>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <MessageCircle className="mx-auto mb-2 h-6 w-6 text-accent lg:mx-0" />
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-bold text-accent hover:underline">
                    {settings.phone}
                  </a>
                </div>
              </div>
              {settings.address && (
                <div className="flex items-start gap-3 rounded-xl border bg-card p-5 shadow-sm w-full">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                    <p className="font-display font-bold text-foreground">{settings.address}</p>
                  </div>
                </div>
              )}
              <Button variant="whatsapp" size="lg" asChild className="w-full px-8 py-6 text-lg rounded-full sm:w-auto">
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar Agora!
                </a>
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245855.47875963425!2d-49.44587820625!3d-16.686891499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef0a04b987d5d%3A0x8f24ac9b2b33bbe8!2sGoi%C3%A2nia%2C%20GO!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Desentupidora Goiânia"
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ========== BAIRROS ATENDIDOS — black text, underline, link style ========== */
interface NeighborhoodItem {
  name: string;
  slug: string;
}

export function BairrosAtendidos({
  neighborhoods,
  localName,
  linkPrefix,
  searchTerm,
}: {
  neighborhoods: NeighborhoodItem[];
  localName: string;
  linkPrefix?: string;
  searchTerm?: string;
}) {
  if (!neighborhoods || neighborhoods.length === 0) return null;
  const term = searchTerm || "desentupidora próxima de mim";

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div {...fadeUp} className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">
            Atendemos {localName ? `no ${localName} e ` : ""}Toda a Região em Goiânia
          </h2>
          <p className="text-muted-foreground">
            Está buscando por "<strong className="text-foreground">{term}</strong>"{localName ? ` no ${localName}` : " em Goiânia-GO"}? Estamos prontos para atender você nos principais bairros da cidade:
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="columns-2 sm:columns-3 lg:columns-4 gap-x-6">
          {neighborhoods.map((n) => (
            <Link
              key={n.slug}
              to={linkPrefix ? `/${linkPrefix}-${n.slug}` : `/${n.slug}`}
              className="mb-2 block text-sm text-foreground underline decoration-foreground/40 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors"
            >
              {n.name}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
