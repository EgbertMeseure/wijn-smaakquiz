/* Copyright (c) 2026 Egbert Meseure. All rights reserved. */
/* =============================================================================
   ASSORTIMENT — dit is het enige bestand dat een wijnhandelaar hoeft te wijzigen
   om de smaakquiz met eigen flessen te laten werken.

   1. Pas SHOP aan (naam, e-mail, korte plaats).
   2. Pas REGIONS aan als uw streken anders zijn (key moet overeenkomen
      met regionKey hieronder).
   3. Pas PRICE_TIERS aan voor uw eigen prijscategorieën.
      min is inbegrepen, max niet (de laatste categorie heeft max: Infinity).
      De labels en bedragen hieronder zijn voorbeelden.
   4. Vervang de WINES-array door uw eigen wijnen.

   Elke wijn:
     id          — unieke sleutel (voor het aantal flessen in de bestelstap)
     name        — naam van de cuvée
     producer    — domein of huis
     type        — 'rood' | 'wit' | 'rose' | 'bubbels' | 'zoet'
     region      — streek, vrij te lezen (bv. 'Rioja · Spanje')
     regionKey   — sleutel uit REGIONS, voor de streekvraag
     grape       — druif of blend
     description — korte toelichting
     price       — prijs in euro, als getal (bv. 12.5). In de demo getoond als
                   voorbeeldprijs. Laat weg of zet op null als de prijs nog
                   niet bekend is.
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

/* Voorbeeld-prijscategorieën — pas labels en grenzen aan naar uw assortiment. */
const PRICE_TIERS = [
  { key: 'tot10',  label: 'Tot €10',    min: 0,  max: 10 },
  { key: '10-15',  label: '€10–€15',    min: 10, max: 15 },
  { key: '15-25',  label: '€15–€25',    min: 15, max: 25 },
  { key: '25plus', label: '€25+',       min: 25, max: Infinity }
];

const WINES = [
  { id: 'rood-huis', name: 'Rode huiswijn', producer: 'Voorbeeldwijn', type: 'rood', region: 'Loire · Frankrijk', areaKey: 'area.loire', regionKey: 'loire', grape: 'Cabernet Franc', description: 'Voorbeeld van een toegankelijke, lichte rode wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 7.5, example: true, image: null, round: .35, body: .35, earthy: .25, sweet: .1, classic: .3, food: ['vlees', 'veg', 'kaas'], occ: ['feest', 'diner'] },
  { id: 'wit-huis', name: 'Witte huiswijn', producer: 'Voorbeeldwijn', type: 'wit', region: 'Loire · Frankrijk', areaKey: 'area.loire', regionKey: 'loire', grape: 'Sauvignon Blanc', description: 'Voorbeeld van een frisse, dagelijkse witte wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 8, example: true, image: null, round: .2, body: .3, earthy: .1, sweet: .05, classic: .3, food: ['vis', 'veg'], occ: ['aperitief', 'diner', 'feest'] },
  { id: 'rose-huis', name: 'Rosé huiswijn', producer: 'Voorbeeldwijn', type: 'rose', region: 'Provence · Frankrijk', areaKey: 'area.provence', regionKey: 'provence', grape: 'Grenache', description: 'Voorbeeld van een lichte, droge rosé. Vervang deze fiche door een wijn uit uw assortiment.', price: 8.5, example: true, image: null, round: .3, body: .25, earthy: .1, sweet: .1, classic: .3, food: ['vis', 'veg'], occ: ['aperitief', 'feest'] },
  { id: 'zoet-huis', name: 'Zoete huiswijn', producer: 'Voorbeeldwijn', type: 'zoet', region: 'Duitsland · Riesling', areaKey: 'area.duitsland2', regionKey: 'duitsland', grape: 'Riesling', description: 'Voorbeeld van een zoete, lichte wijn bij dessert. Vervang deze fiche door een wijn uit uw assortiment.', price: 9, example: true, image: null, round: .55, body: .35, earthy: .1, sweet: .7, classic: .35, food: ['dessert', 'kaas'], occ: ['diner', 'feest'] },
  { id: 'rood-zomer', name: 'Lichte rode zomerwijn', producer: 'Voorbeeldwijn', type: 'rood', region: 'Loire · Frankrijk', areaKey: 'area.loire', regionKey: 'loire', grape: 'Gamay', description: 'Voorbeeld van een fruitige, lichte rode wijn, licht gekoeld. Vervang deze fiche door een wijn uit uw assortiment.', price: 9.5, example: true, image: null, round: .3, body: .3, earthy: .2, sweet: .1, classic: .25, food: ['vlees', 'veg', 'vis'], occ: ['aperitief', 'feest', 'diner'] },
  { id: 'wit-zomer', name: 'Frisse witte zomerwijn', producer: 'Voorbeeldwijn', type: 'wit', region: 'Loire · Frankrijk', areaKey: 'area.loire', regionKey: 'loire', grape: 'Melon de Bourgogne', description: 'Voorbeeld van een strakke, minerale witte wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 9.5, example: true, image: null, round: .15, body: .3, earthy: .15, sweet: .05, classic: .35, food: ['vis', 'veg'], occ: ['aperitief', 'diner'] },

  { id: 'rood-gamay', name: 'Beaujolais-stijl', producer: 'Voorbeeldwijn', type: 'rood', region: 'Bourgogne · Frankrijk', areaKey: 'area.bourgogne', regionKey: 'bourgogne', grape: 'Gamay', description: 'Voorbeeld van een sappige, fruitige rode wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 11.5, example: true, image: null, round: .35, body: .4, earthy: .25, sweet: .08, classic: .4, food: ['vlees', 'veg', 'kaas'], occ: ['feest', 'diner'] },
  { id: 'bubbels-cava', name: 'Brut Bubbels', producer: 'Voorbeeldwijn', type: 'bubbels', region: 'Champagne · Frankrijk', areaKey: 'area.champagne', regionKey: 'champagne', grape: 'Chardonnay & Pinot Noir', description: 'Voorbeeld van een droge mousserende wijn in een toegankelijke stijl. Vervang deze fiche door een wijn uit uw assortiment.', price: 12, example: true, image: null, round: .25, body: .3, earthy: .1, sweet: .1, classic: .5, food: ['vis', 'dessert'], occ: ['aperitief', 'feest', 'cadeau'] },
  { id: 'wit-sauvignon', name: 'Sauvignon Blanc', producer: 'Voorbeeldwijn', type: 'wit', region: 'Loire · Frankrijk', areaKey: 'area.loire', regionKey: 'loire', grape: 'Sauvignon Blanc', description: 'Voorbeeld van een frisse, minerale witte wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 12.5, example: true, image: null, round: .2, body: .35, earthy: .15, sweet: .05, classic: .6, food: ['vis', 'veg'], occ: ['aperitief', 'diner'] },
  { id: 'rose-provence', name: 'Rosé de Provence', producer: 'Voorbeeldwijn', type: 'rose', region: 'Provence · Frankrijk', areaKey: 'area.provence', regionKey: 'provence', grape: 'Grenache & Cinsault', description: 'Voorbeeld van een droge, lichte rosé. Vervang deze fiche door een wijn uit uw assortiment.', price: 13, example: true, image: null, round: .35, body: .3, earthy: .15, sweet: .1, classic: .5, food: ['vis', 'veg'], occ: ['aperitief', 'feest', 'diner'] },
  { id: 'wit-riesling', name: 'Riesling', producer: 'Voorbeeldwijn', type: 'wit', region: 'Moezel · Duitsland', areaKey: 'area.duitsland', regionKey: 'duitsland', grape: 'Riesling', description: 'Voorbeeld van een aromatische witte wijn, van droog tot zacht. Vervang deze fiche door een wijn uit uw assortiment.', price: 14, example: true, image: null, round: .35, body: .35, earthy: .15, sweet: .35, classic: .5, food: ['vis', 'veg', 'kaas'], occ: ['aperitief', 'diner'] },
  { id: 'rood-sangiovese', name: 'Sangiovese', producer: 'Voorbeeldwijn', type: 'rood', region: 'Toscane · Italië', areaKey: 'area.toscane', regionKey: 'toscane', grape: 'Sangiovese', description: 'Voorbeeld van een sappige rode wijn bij de maaltijd. Vervang deze fiche door een wijn uit uw assortiment.', price: 14.5, example: true, image: null, round: .4, body: .65, earthy: .6, sweet: .05, classic: .7, food: ['vlees', 'kaas', 'veg'], occ: ['diner', 'feest'] },

  { id: 'rose-prestige', name: 'Rosé Prestige', producer: 'Voorbeeldwijn', type: 'rose', region: 'Provence · Frankrijk', areaKey: 'area.provence', regionKey: 'provence', grape: 'Grenache & Syrah', description: 'Voorbeeld van een iets rijker uitgebouwde rosé. Vervang deze fiche door een wijn uit uw assortiment.', price: 16.5, example: true, image: null, round: .45, body: .4, earthy: .2, sweet: .08, classic: .55, food: ['vis', 'veg', 'kaas'], occ: ['aperitief', 'diner', 'cadeau'] },
  { id: 'rood-cuvee', name: 'Cuvée Rouge', producer: 'Voorbeeldwijn', type: 'rood', region: 'Bordeaux · Frankrijk', areaKey: 'area.bordeaux', regionKey: 'bordeaux', grape: 'Cabernet Sauvignon & Merlot', description: 'Voorbeeld van een klassieke, krachtige rode blend. Vervang deze fiche door een wijn uit uw assortiment.', price: 18.5, example: true, image: null, round: .6, body: .85, earthy: .7, sweet: .05, classic: .9, food: ['vlees', 'wild', 'kaas'], occ: ['diner', 'cadeau'] },
  { id: 'wit-chardonnay', name: 'Chardonnay', producer: 'Voorbeeldwijn', type: 'wit', region: 'Bourgogne · Frankrijk', areaKey: 'area.bourgogne', regionKey: 'bourgogne', grape: 'Chardonnay', description: 'Voorbeeld van een ronde, gastronomische witte wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 19, example: true, image: null, round: .65, body: .55, earthy: .2, sweet: .1, classic: .75, food: ['vis', 'veg', 'kaas'], occ: ['diner', 'aperitief'] },
  { id: 'rood-syrah', name: 'Syrah', producer: 'Voorbeeldwijn', type: 'rood', region: 'Rhône · Frankrijk', areaKey: 'area.rhone', regionKey: 'rhone', grape: 'Syrah', description: 'Voorbeeld van een kruidige, krachtige rode wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 21, example: true, image: null, round: .5, body: .85, earthy: .85, sweet: .05, classic: .55, food: ['vlees', 'wild'], occ: ['diner', 'feest'] },
  { id: 'bubbels-cremant', name: 'Crémant-stijl', producer: 'Voorbeeldwijn', type: 'bubbels', region: 'Champagne · Frankrijk', areaKey: 'area.champagne', regionKey: 'champagne', grape: 'Chardonnay', description: 'Voorbeeld van een verfijnde mousserende wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 22, example: true, image: null, round: .3, body: .4, earthy: .15, sweet: .08, classic: .7, food: ['vis', 'dessert', 'kaas'], occ: ['aperitief', 'feest', 'cadeau'] },
  { id: 'rood-pinot', name: 'Pinot Noir', producer: 'Voorbeeldwijn', type: 'rood', region: 'Bourgogne · Frankrijk', areaKey: 'area.bourgogne', regionKey: 'bourgogne', grape: 'Pinot Noir', description: 'Voorbeeld van een fijne, lichtere rode wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 24, example: true, image: null, round: .4, body: .4, earthy: .5, sweet: .05, classic: .85, food: ['vlees', 'vis', 'veg', 'kaas'], occ: ['diner', 'cadeau'] },

  { id: 'zoet-oogst', name: 'Zoete oogst', producer: 'Voorbeeldwijn', type: 'zoet', region: 'Bordeaux · Frankrijk', areaKey: 'area.bordeaux', regionKey: 'bordeaux', grape: 'Sémillon & Sauvignon Blanc', description: 'Voorbeeld van een zoete wijn bij dessert of gerijpte kaas. Vervang deze fiche door een wijn uit uw assortiment.', price: 27, example: true, image: null, round: .8, body: .6, earthy: .25, sweet: .9, classic: .75, food: ['dessert', 'kaas'], occ: ['diner', 'cadeau', 'feest'] },
  { id: 'rood-rioja', name: 'Rioja Reserva', producer: 'Voorbeeldwijn', type: 'rood', region: 'Rioja · Spanje', areaKey: 'area.spanje', regionKey: 'spanje', grape: 'Tempranillo', description: 'Voorbeeld van een gerijpte, ronde rode wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 28, example: true, image: null, round: .75, body: .75, earthy: .55, sweet: .1, classic: .8, food: ['vlees', 'kaas'], occ: ['diner', 'cadeau'] },
  { id: 'wit-bourgogne', name: 'Witte Bourgogne-stijl', producer: 'Voorbeeldwijn', type: 'wit', region: 'Bourgogne · Frankrijk', areaKey: 'area.bourgogne', regionKey: 'bourgogne', grape: 'Chardonnay', description: 'Voorbeeld van een rijke, gastronomische witte wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 29, example: true, image: null, round: .75, body: .65, earthy: .25, sweet: .1, classic: .85, food: ['vis', 'kaas', 'veg'], occ: ['diner', 'cadeau'] },
  { id: 'rood-nebbiolo', name: 'Nebbiolo', producer: 'Voorbeeldwijn', type: 'rood', region: 'Piemonte · Italië', areaKey: 'area.piemonte', regionKey: 'piemonte', grape: 'Nebbiolo', description: 'Voorbeeld van een strakke, aromatische rode wijn met karakter. Vervang deze fiche door een wijn uit uw assortiment.', price: 32, example: true, image: null, round: .4, body: .7, earthy: .7, sweet: .05, classic: .8, food: ['vlees', 'wild', 'kaas'], occ: ['diner', 'cadeau'] },
  { id: 'bubbels-prestige', name: 'Brut Prestige', producer: 'Voorbeeldwijn', type: 'bubbels', region: 'Champagne · Frankrijk', areaKey: 'area.champagne', regionKey: 'champagne', grape: 'Chardonnay & Pinot Noir', description: 'Voorbeeld van een feestelijke, droge mousserende wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 38, example: true, image: null, round: .3, body: .35, earthy: .15, sweet: .1, classic: .85, food: ['vis', 'dessert'], occ: ['aperitief', 'feest', 'cadeau'] },
  { id: 'rood-granreserva', name: 'Gran Reserva', producer: 'Voorbeeldwijn', type: 'rood', region: 'Rioja · Spanje', areaKey: 'area.spanje', regionKey: 'spanje', grape: 'Tempranillo', description: 'Voorbeeld van een lang gerijpte, krachtige rode wijn. Vervang deze fiche door een wijn uit uw assortiment.', price: 42, example: true, image: null, round: .8, body: .9, earthy: .65, sweet: .1, classic: .9, food: ['vlees', 'wild', 'kaas'], occ: ['diner', 'cadeau'] }
];
