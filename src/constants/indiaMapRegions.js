/** Language region metadata + state → region mapping for @svg-maps/india */

export const MAP_VIEWBOX = '0 0 612 696';

export const LANGUAGE_REGIONS = [
  { id: 'kashmir', label: 'Jammu & Kashmir', color: '#B8C9D9', hoverColor: '#7A9BB5' },
  { id: 'punjab', label: 'Punjab & Haryana', color: '#E8D4BC', hoverColor: '#C9B08E' },
  { id: 'hindi_belt', label: 'Hindi Belt', color: '#E5D0BE', hoverColor: '#C4956A' },
  { id: 'himalaya', label: 'Himalayan States', color: '#C8D9CC', hoverColor: '#8FB59A' },
  { id: 'gujarat', label: 'Gujarat & UT', color: '#EDD9C4', hoverColor: '#D4A574' },
  { id: 'maharashtra', label: 'Maharashtra & Goa', color: '#D9C4A8', hoverColor: '#B8956A' },
  { id: 'bengal', label: 'West Bengal', color: '#E8D0E0', hoverColor: '#D4A8C7' },
  { id: 'northeast', label: 'North-East India', color: '#B8D4DE', hoverColor: '#6E9EB5' },
  { id: 'odisha', label: 'Odisha', color: '#D4CCC4', hoverColor: '#A89880' },
  { id: 'east_central', label: 'Jharkhand & Chhattisgarh', color: '#C9BEB4', hoverColor: '#9A8B78' },
  { id: 'andhra', label: 'Andhra & Telangana', color: '#E5D4A8', hoverColor: '#C4A060' },
  { id: 'karnataka', label: 'Karnataka', color: '#D0D9C4', hoverColor: '#8B9A6A' },
  { id: 'tamil_nadu', label: 'Tamil Nadu & Puducherry', color: '#E0C4BC', hoverColor: '#B87A6A' },
  { id: 'kerala', label: 'Kerala & Lakshadweep', color: '#B8D4C8', hoverColor: '#6A9A8B' },
  { id: 'pan_india', label: 'Pan-India (Link language)', color: '#F0EAE4', hoverColor: '#C4B8A8' },
];

/** @svg-maps/india location id → language region id */
export const STATE_TO_REGION = {
  jk: 'kashmir',
  pb: 'punjab',
  ch: 'punjab',
  hr: 'punjab',
  hp: 'himalaya',
  ut: 'himalaya',
  sk: 'himalaya',
  ar: 'northeast',
  as: 'northeast',
  mn: 'northeast',
  ml: 'northeast',
  mz: 'northeast',
  nl: 'northeast',
  tr: 'northeast',
  up: 'hindi_belt',
  mp: 'hindi_belt',
  rj: 'hindi_belt',
  br: 'hindi_belt',
  dl: 'hindi_belt',
  ct: 'east_central',
  jh: 'east_central',
  gj: 'gujarat',
  dn: 'gujarat',
  dd: 'gujarat',
  mh: 'maharashtra',
  ga: 'maharashtra',
  wb: 'bengal',
  or: 'odisha',
  ap: 'andhra',
  tg: 'andhra',
  ka: 'karnataka',
  tn: 'tamil_nadu',
  py: 'tamil_nadu',
  kl: 'kerala',
  ld: 'kerala',
  an: 'tamil_nadu',
};

export function getRegionMeta(regionId) {
  return LANGUAGE_REGIONS.find((r) => r.id === regionId);
}

export function getRegionForState(stateId) {
  return STATE_TO_REGION[stateId] ?? 'hindi_belt';
}

export function getStatesForRegion(regionId) {
  return Object.entries(STATE_TO_REGION)
    .filter(([, rid]) => rid === regionId)
    .map(([stateId]) => stateId);
}
