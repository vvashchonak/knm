import type { Question, SessionQuestion } from './types';

export function shuffle<T>(arr: readonly T[]): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickRandom<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export function buildSession(bank: Question[], n: number): SessionQuestion[] {
  return pickRandom(bank, n).map((question) => {
    const indexed = question.options.map((text, originalIndex) => ({
      text,
      originalIndex,
    }));
    return {
      question,
      shuffledOptions: shuffle(indexed),
      selectedShuffledIndex: null,
      checked: false,
    };
  });
}

export function isCorrect(sq: SessionQuestion): boolean {
  if (sq.selectedShuffledIndex === null) return false;
  return (
    sq.shuffledOptions[sq.selectedShuffledIndex].originalIndex ===
    sq.question.correctIndex
  );
}

export function countCorrect(session: SessionQuestion[]): number {
  return session.filter(isCorrect).length;
}

const UNTAGGED = 'Overig';

export function topicOf(q: Question): string {
  return q.topic && q.topic.trim() ? q.topic : UNTAGGED;
}

// De 7 thema's uit Welkom in Nederland (Gathier), in volgorde van het boek.
export const THEMES = [
  '1. Samenleven in Nederland',
  '2. Gezondheidszorg in Nederland',
  '3. Wonen in Nederland',
  '4. Opvoeding en onderwijs in Nederland',
  '5. Werken in Nederland',
  '6. Instanties in Nederland',
  '7. De Nederlandse staat',
] as const;

export type Theme = (typeof THEMES)[number];

// Mapping van bestaande topics naar de 7 hoofdthema's.
const TOPIC_TO_THEME: Record<string, Theme> = {
  // 1. Samenleven
  'Belangrijke dagen': '1. Samenleven in Nederland',
  'De buren': '1. Samenleven in Nederland',
  Feestdagen: '1. Samenleven in Nederland',
  Samenleven: '1. Samenleven in Nederland',
  'Samenleven extra': '1. Samenleven in Nederland',

  // 2. Gezondheidszorg
  Ziek: '2. Gezondheidszorg in Nederland',
  Gezondheidszorg: '2. Gezondheidszorg in Nederland',
  'Gezondheidszorg extra': '2. Gezondheidszorg in Nederland',

  // 3. Wonen
  'Nederland en het water': '3. Wonen in Nederland',
  Wonen: '3. Wonen in Nederland',
  Provincies: '3. Wonen in Nederland',
  'Wonen extra': '3. Wonen in Nederland',
  'Steden en gebieden': '3. Wonen in Nederland',
  'Wonen en water extra': '3. Wonen in Nederland',

  // 4. Opvoeding en onderwijs
  School: '4. Opvoeding en onderwijs in Nederland',
  'School extra': '4. Opvoeding en onderwijs in Nederland',
  Onderwijs: '4. Opvoeding en onderwijs in Nederland',

  // 5. Werken
  Werk: '5. Werken in Nederland',
  'Werk extra': '5. Werken in Nederland',

  // 6. Instanties
  'Belasting, subsidie en uitkering': '6. Instanties in Nederland',
  'De gemeente': '6. Instanties in Nederland',
  Geld: '6. Instanties in Nederland',
  Verzekeringen: '6. Instanties in Nederland',
  'Help!': '6. Instanties in Nederland',
  Instanties: '6. Instanties in Nederland',
  'Belasting extra': '6. Instanties in Nederland',
  'Financiën en hulp': '6. Instanties in Nederland',
  'Overheid digitaal': '6. Instanties in Nederland',
  'Politie en klachten': '6. Instanties in Nederland',
  Verblijfsvergunning: '6. Instanties in Nederland',

  // 7. De Nederlandse staat
  'Democratie in Nederland': '7. De Nederlandse staat',
  'De Tweede Wereldoorlog': '7. De Nederlandse staat',
  Oranje: '7. De Nederlandse staat',
  'De wet': '7. De Nederlandse staat',
  'Na de wederopbouw': '7. De Nederlandse staat',
  Geschiedenis: '7. De Nederlandse staat',
  'Het koningshuis': '7. De Nederlandse staat',
  'De Nederlandse staat': '7. De Nederlandse staat',
  Internationaal: '7. De Nederlandse staat',
  Rechtsstaat: '7. De Nederlandse staat',
  'Politiek extra': '7. De Nederlandse staat',
  'Geschiedenis extra': '7. De Nederlandse staat',
};

export function themeOf(q: Question): Theme | null {
  return TOPIC_TO_THEME[topicOf(q)] ?? null;
}

export function countByTheme(bank: Question[]): Map<Theme, number> {
  const map = new Map<Theme, number>();
  for (const theme of THEMES) map.set(theme, 0);
  for (const q of bank) {
    const t = themeOf(q);
    if (t) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return map;
}

export function filterByThemes(
  bank: Question[],
  selectedThemes: ReadonlySet<Theme>,
): Question[] {
  if (selectedThemes.size === 0) return [];
  return bank.filter((q) => {
    const t = themeOf(q);
    return t !== null && selectedThemes.has(t);
  });
}
