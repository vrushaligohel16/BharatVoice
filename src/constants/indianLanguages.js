/**
 * All 22 languages in the Eighth Schedule of the Indian Constitution,
 * plus English as the link/official associate language.
 */
import { LANGUAGE_REGIONS } from './indiaMapRegions';

export { LANGUAGE_REGIONS };

export const INDIAN_LANGUAGES = [
  { id: 'hindi', name: 'Hindi', native: 'हिन्दी', regionId: 'hindi_belt', tags: ['hindi', 'devanagari'] },
  { id: 'english', name: 'English', native: 'English', regionId: 'pan_india', tags: ['english', 'link'], linkLanguage: true },
  { id: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી', regionId: 'gujarat', tags: ['gujarati'] },
  { id: 'marathi', name: 'Marathi', native: 'मराठी', regionId: 'maharashtra', tags: ['marathi'] },
  { id: 'bengali', name: 'Bengali', native: 'বাংলা', regionId: 'bengal', tags: ['bengali', 'bangla'] },
  { id: 'tamil', name: 'Tamil', native: 'தமிழ்', regionId: 'tamil_nadu', tags: ['tamil'] },
  { id: 'telugu', name: 'Telugu', native: 'తెలుగు', regionId: 'andhra', tags: ['telugu'] },
  { id: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ', regionId: 'karnataka', tags: ['kannada'] },
  { id: 'malayalam', name: 'Malayalam', native: 'മലയാളം', regionId: 'kerala', tags: ['malayalam'] },
  { id: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', regionId: 'punjab', tags: ['punjabi'] },
  { id: 'odia', name: 'Odia', native: 'ଓଡ଼ିଆ', regionId: 'odisha', tags: ['odia', 'oriya'] },
  { id: 'assamese', name: 'Assamese', native: 'অসমীয়া', regionId: 'northeast', tags: ['assamese', 'assam'] },
  { id: 'urdu', name: 'Urdu', native: 'اردو', regionId: 'hindi_belt', tags: ['urdu'] },
  { id: 'sanskrit', name: 'Sanskrit', native: 'संस्कृतम्', regionId: 'hindi_belt', tags: ['sanskrit'] },
  { id: 'konkani', name: 'Konkani', native: 'कोंकणी', regionId: 'maharashtra', tags: ['konkani', 'goa'] },
  { id: 'manipuri', name: 'Manipuri (Meitei)', native: 'ꯃꯤꯇꯩ ꯂꯣꯟ', regionId: 'northeast', tags: ['manipuri', 'meitei'] },
  { id: 'bodo', name: 'Bodo', native: 'बड़ो', regionId: 'northeast', tags: ['bodo'] },
  { id: 'santhali', name: 'Santhali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', regionId: 'east_central', tags: ['santhali', 'santali'] },
  { id: 'maithili', name: 'Maithili', native: 'मैथिली', regionId: 'hindi_belt', tags: ['maithili', 'bihar'] },
  { id: 'dogri', name: 'Dogri', native: 'डोगरी', regionId: 'kashmir', tags: ['dogri', 'jammu'] },
  { id: 'nepali', name: 'Nepali', native: 'नेपाली', regionId: 'himalaya', tags: ['nepali', 'sikkim'] },
  { id: 'kashmiri', name: 'Kashmiri', native: 'کٲشُر', regionId: 'kashmir', tags: ['kashmiri'] },
  { id: 'sindhi', name: 'Sindhi', native: 'سنڌي', regionId: 'gujarat', tags: ['sindhi'] },
];

export const FLOATING_SCRIPTS = [
  { text: 'हिन्दी', x: 8, y: 4 },
  { text: 'ગુજરાતી', x: 72, y: 2 },
  { text: 'தமிழ்', x: 76, y: 82 },
  { text: 'বাংলা', x: 2, y: 42 },
  { text: 'తెలుగు', x: 50, y: 58 },
  { text: 'മലയാളം', x: 6, y: 90 },
];

export function getLanguagesByRegion(regionId) {
  return INDIAN_LANGUAGES.filter((l) => l.regionId === regionId);
}

export function getRegionForLanguage(languageId) {
  const lang = INDIAN_LANGUAGES.find((l) => l.id === languageId);
  return lang?.regionId ?? null;
}

/** ISO 639-1 / common codes for form selects */
const LANGUAGE_CODES = {
  hindi: 'hi',
  english: 'en',
  gujarati: 'gu',
  marathi: 'mr',
  bengali: 'bn',
  tamil: 'ta',
  telugu: 'te',
  kannada: 'kn',
  malayalam: 'ml',
  punjabi: 'pa',
  odia: 'or',
  assamese: 'as',
  urdu: 'ur',
  sanskrit: 'sa',
  konkani: 'kok',
  manipuri: 'mni',
  bodo: 'brx',
  santhali: 'sat',
  maithili: 'mai',
  dogri: 'doi',
  nepali: 'ne',
  kashmiri: 'ks',
  sindhi: 'sd',
};

function buildInputLanguageOptions() {
  const options = INDIAN_LANGUAGES.map((lang) => ({
    value: LANGUAGE_CODES[lang.id] ?? lang.id,
    name: lang.name,
    native: lang.native,
    label: lang.linkLanguage ? `${lang.name} (link language)` : `${lang.name} — ${lang.native}`,
  }));

  const hindi = options.find((o) => o.value === 'hi');
  const english = options.find((o) => o.value === 'en');
  const rest = options
    .filter((o) => o.value !== 'hi' && o.value !== 'en')
    .sort((a, b) => a.name.localeCompare(b.name));

  return [hindi, english, ...rest].filter(Boolean);
}

/** All 23 languages for dropdowns (Input page, profile, etc.) */
export const INPUT_LANGUAGE_OPTIONS = buildInputLanguageOptions();

export const INPUT_LANGUAGE_COUNT = INDIAN_LANGUAGES.length;
