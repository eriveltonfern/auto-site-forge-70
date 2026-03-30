/**
 * Returns the correct Portuguese preposition ("no" or "na") for a neighborhood name.
 * "no" for masculine words (Setor, Jardim, Parque, Residencial, Conjunto, Bairro, Centro, Condomínio, Loteamento, Village)
 * "na" for feminine words (Vila, Chácara, Fazenda, Aldeia) or default
 */
const masculineStarts = [
  "setor", "jardim", "parque", "residencial", "conjunto", "bairro",
  "centro", "condomínio", "condômino", "loteamento", "village", "recanto",
  "portal", "alto", "vale",
];

export function preposicao(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const prefix of masculineStarts) {
    if (lower.startsWith(prefix)) return "no";
  }
  return "na";
}

/** Returns "no Nome" or "na Nome" */
export function noNa(name: string): string {
  return `${preposicao(name)} ${name}`;
}
