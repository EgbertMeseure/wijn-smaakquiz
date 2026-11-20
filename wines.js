/* =============================================================================
   ASSORTIMENT — dit is het enige bestand dat een wijnhandelaar hoeft te wijzigen
   om de smaakquiz met eigen flessen te laten werken.

   1. Pas SHOP aan (naam, e-mail, korte plaats).
   2. Pas REGIONS aan als uw streken anders zijn (key moet overeenkomen
      met regionKey hieronder).
   3. Vervang de WINES-array door uw eigen wijnen.

   Elke wijn:
     name        — naam van de cuvée
     producer    — domein of huis
     type        — 'rood' | 'wit' | 'rose' | 'bubbels' | 'zoet'
     region      — streek, vrij te lezen (bv. 'Rioja · Spanje')
     regionKey   — sleutel uit REGIONS, voor de streekvraag
     grape       — druif of blend
     description — korte toelichting
     price       — toonprijs; gebruik '€ —' zolang de prijs niet bekend is
     example     — true = voorbeeldwijn in deze demo (mag weggelaten bij echte flessen)
     image       — optioneel pad of URL naar een flesfoto; anders verschijnt een tekening
     // smaakprofiel, 0 (weinig) tot 1 (veel):
     round, body, earthy, sweet, classic
     food        — een of meer van: 'vis' | 'vlees' | 'wild' | 'kaas' | 'veg' | 'dessert'
     occ         — een of meer van: 'aperitief' | 'diner' | 'cadeau' | 'feest'
   ============================================================================= */

const SHOP = {
  name: 'Uw Wijnhuis',
  email: 'info@uwwijnhuis.be',
  place: 'België'
};

const REGIONS = [
  { key: 'bordeaux',  label: 'Bordeaux · Cabernet & Merlot' },
  { key: 'bourgogne', label: 'Bourgogne · Pinot Noir & Chardonnay' },
  { key: 'rhone',     label: 'Rhône · Syrah & Grenache' },
  { key: 'loire',     label: 'Loire · Sauvignon Blanc' },
  { key: 'champagne', label: 'Champagne & crémant' },
  { key: 'provence',  label: 'Provence · Rosé' },
  { key: 'piemonte',  label: 'Piemonte · Nebbiolo' },
  { key: 'toscane',   label: 'Toscane · Sangiovese' },
  { key: 'spanje',    label: 'Spanje · Tempranillo' },
  { key: 'duitsland', label: 'Duitsland · Riesling' }
];

const WINES = [
  {
    name: 'Cuvée Rouge',
    producer: 'Voorbeeldwijn',
    type: 'rood',
    region: 'Bordeaux · Frankrijk',
    regionKey: 'bordeaux',
    grape: 'Cabernet Sauvignon & Merlot',
    description: 'Voorbeeld van een klassieke, krachtige rode blend. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .6, body: .85, earthy: .7, sweet: .05, classic: .9,
    food: ['vlees', 'wild', 'kaas'],
    occ: ['diner', 'cadeau']
  },
  {
    name: 'Pinot Noir',
    producer: 'Voorbeeldwijn',
    type: 'rood',
    region: 'Bourgogne · Frankrijk',
    regionKey: 'bourgogne',
    grape: 'Pinot Noir',
    description: 'Voorbeeld van een fijne, lichtere rode wijn. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .4, body: .4, earthy: .5, sweet: .05, classic: .85,
    food: ['vlees', 'vis', 'veg', 'kaas'],
    occ: ['diner', 'cadeau']
  },
  {
    name: 'Syrah',
    producer: 'Voorbeeldwijn',
    type: 'rood',
    region: 'Rhône · Frankrijk',
    regionKey: 'rhone',
    grape: 'Syrah',
    description: 'Voorbeeld van een kruidige, krachtige rode wijn. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .5, body: .85, earthy: .85, sweet: .05, classic: .55,
    food: ['vlees', 'wild'],
    occ: ['diner', 'feest']
  },
  {
    name: 'Sangiovese',
    producer: 'Voorbeeldwijn',
    type: 'rood',
    region: 'Toscane · Italië',
    regionKey: 'toscane',
    grape: 'Sangiovese',
    description: 'Voorbeeld van een sappige rode wijn bij de maaltijd. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .4, body: .65, earthy: .6, sweet: .05, classic: .7,
    food: ['vlees', 'kaas', 'veg'],
    occ: ['diner', 'feest']
  },
  {
    name: 'Rioja Reserva',
    producer: 'Voorbeeldwijn',
    type: 'rood',
    region: 'Rioja · Spanje',
    regionKey: 'spanje',
    grape: 'Tempranillo',
    description: 'Voorbeeld van een gerijpte, ronde rode wijn. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .75, body: .75, earthy: .55, sweet: .1, classic: .8,
    food: ['vlees', 'kaas'],
    occ: ['diner', 'cadeau']
  },
  {
    name: 'Chardonnay',
    producer: 'Voorbeeldwijn',
    type: 'wit',
    region: 'Bourgogne · Frankrijk',
    regionKey: 'bourgogne',
    grape: 'Chardonnay',
    description: 'Voorbeeld van een ronde, gastronomische witte wijn. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .65, body: .55, earthy: .2, sweet: .1, classic: .75,
    food: ['vis', 'veg', 'kaas'],
    occ: ['diner', 'aperitief']
  },
  {
    name: 'Sauvignon Blanc',
    producer: 'Voorbeeldwijn',
    type: 'wit',
    region: 'Loire · Frankrijk',
    regionKey: 'loire',
    grape: 'Sauvignon Blanc',
    description: 'Voorbeeld van een frisse, minerale witte wijn. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .2, body: .35, earthy: .15, sweet: .05, classic: .6,
    food: ['vis', 'veg'],
    occ: ['aperitief', 'diner']
  },
  {
    name: 'Riesling',
    producer: 'Voorbeeldwijn',
    type: 'wit',
    region: 'Moezel · Duitsland',
    regionKey: 'duitsland',
    grape: 'Riesling',
    description: 'Voorbeeld van een aromatische witte wijn, van droog tot zacht. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .35, body: .35, earthy: .15, sweet: .35, classic: .5,
    food: ['vis', 'veg', 'kaas'],
    occ: ['aperitief', 'diner']
  },
  {
    name: 'Rosé de Provence',
    producer: 'Voorbeeldwijn',
    type: 'rose',
    region: 'Provence · Frankrijk',
    regionKey: 'provence',
    grape: 'Grenache & Cinsault',
    description: 'Voorbeeld van een droge, lichte rosé. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .35, body: .3, earthy: .15, sweet: .1, classic: .5,
    food: ['vis', 'veg'],
    occ: ['aperitief', 'feest', 'diner']
  },
  {
    name: 'Brut Bubbels',
    producer: 'Voorbeeldwijn',
    type: 'bubbels',
    region: 'Champagne · Frankrijk',
    regionKey: 'champagne',
    grape: 'Chardonnay & Pinot Noir',
    description: 'Voorbeeld van een droge mousserende wijn. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .3, body: .35, earthy: .15, sweet: .1, classic: .85,
    food: ['vis', 'dessert'],
    occ: ['aperitief', 'feest', 'cadeau']
  },
  {
    name: 'Zoete oogst',
    producer: 'Voorbeeldwijn',
    type: 'zoet',
    region: 'Bordeaux · Frankrijk',
    regionKey: 'bordeaux',
    grape: 'Sémillon & Sauvignon Blanc',
    description: 'Voorbeeld van een zoete wijn bij dessert of gerijpte kaas. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .8, body: .6, earthy: .25, sweet: .9, classic: .75,
    food: ['dessert', 'kaas'],
    occ: ['diner', 'cadeau', 'feest']
  },
  {
    name: 'Nebbiolo',
    producer: 'Voorbeeldwijn',
    type: 'rood',
    region: 'Piemonte · Italië',
    regionKey: 'piemonte',
    grape: 'Nebbiolo',
    description: 'Voorbeeld van een strakke, aromatische rode wijn met karakter. Vervang deze fiche door een wijn uit uw assortiment.',
    price: '€ —',
    example: true,
    image: null,
    round: .4, body: .7, earthy: .7, sweet: .05, classic: .8,
    food: ['vlees', 'wild', 'kaas'],
    occ: ['diner', 'cadeau']
  }
];
