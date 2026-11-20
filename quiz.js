if (/(?:^|[?&])shot=full(?:&|$)/.test(location.search)) document.documentElement.classList.add('shot-full');
/* Gedeelde quizlogica voor alle drie de stijlen.
   Verwacht: wines.js (SHOP, REGIONS, WINES) en de HTML-structuur van de stijlpagina's. */

const COLOR_NAME = { rood: 'Rood', wit: 'Wit', rose: 'Rosé', bubbels: 'Bubbels', zoet: 'Zoet' };
const FOOD_NAME = { vis: 'vis', vlees: 'vlees', wild: 'wild', kaas: 'kaas', veg: 'vegetarisch', dessert: 'dessert' };
const FLOW = ['occ', 'food', 'color', 'taste', 'region', 'budget', 'result', 'order', 'thanks'];

const st = {
  occ: null,
  food: [],
  color: [],
  region: [],
  style: null,
  budget: null,
  taste: { round: .5, body: .5, earthy: .5, sweet: .2 },
  qty: 6,
  picks: []
};

let flow = FLOW.slice(), idx = 0;

const intro = document.getElementById('intro');
const quizEl = document.getElementById('quiz');
const steps = [...document.querySelectorAll('.step')];

function fillShop() {
  document.querySelectorAll('[data-brand]').forEach(el => { el.textContent = SHOP.name; });
  document.querySelectorAll('[data-email]').forEach(el => { el.textContent = SHOP.email; });
  const tmsg = document.getElementById('tmsg');
  if (tmsg) {
    tmsg.textContent = 'Je aanvraag is goed ontvangen. ' + SHOP.name + ' neemt snel contact met je op om je bestelling te bevestigen.';
  }
}

function renderRegions() {
  const box = document.getElementById('region-chips');
  if (!box) return;
  box.innerHTML = REGIONS.map(r =>
    `<button type="button" class="chip" data-v="${r.key}">${r.label}</button>`
  ).join('');
}

function showIntro() {
  intro.hidden = false;
  quizEl.hidden = true;
  document.body.classList.remove('quiz-on');
}

function showQuiz() {
  intro.hidden = true;
  quizEl.hidden = false;
  document.body.classList.add('quiz-on');
  show();
}

function show() {
  const key = flow[idx];
  steps.forEach(s => s.classList.toggle('on', s.dataset.s === key));
  const denom = Math.max(1, flow.length - 1);
  document.getElementById('pbar').style.width = Math.round(idx / denom * 100) + '%';
  const back = document.getElementById('qback');
  const nextBtn = document.getElementById('qnext');
  const skip = document.getElementById('qskip');
  const foot = document.querySelector('.qfoot');
  back.style.visibility = (idx === 0 || key === 'thanks') ? 'hidden' : 'visible';
  skip.style.visibility = (key === 'region' || key === 'food') ? 'visible' : 'hidden';
  nextBtn.style.display = key === 'thanks' ? 'none' : '';
  foot.style.display = key === 'thanks' ? 'none' : '';
  nextBtn.textContent =
    key === 'budget' ? 'Toon mijn selectie →' :
    key === 'result' ? 'Bestel of reserveer →' :
    key === 'order' ? 'Verstuur aanvraag' :
    'Volgende →';
  if (key === 'result') renderResult();
  if (key === 'order') renderOrder();
  const body = document.querySelector('.qbody');
  if (body) body.scrollTop = 0;
  window.scrollTo(0, 0);
}

function startQuiz() {
  flow = FLOW.slice();
  idx = 0;
  showQuiz();
}

function resetQuiz() {
  st.occ = null;
  st.food = [];
  st.color = [];
  st.region = [];
  st.style = null;
  st.budget = null;
  st.taste = { round: .5, body: .5, earthy: .5, sweet: .2 };
  st.qty = 6;
  st.picks = [];
  document.querySelectorAll('.opt.sel, .chip.sel').forEach(el => el.classList.remove('sel'));
  document.querySelectorAll('[data-t]').forEach(r => {
    r.value = r.dataset.t === 'sweet' ? 20 : 50;
  });
  const qn = document.getElementById('qn');
  if (qn) qn.value = 6;
  ['f_name', 'f_mail', 'f_tel', 'f_lev', 'f_note'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.tagName !== 'SELECT') el.value = '';
    if (el) el.style.borderColor = '';
  });
  showIntro();
  if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
}

function markSel(q, v) {
  document.querySelectorAll(`[data-q="${q}"] [data-v]`).forEach(b => b.classList.toggle('sel', b.dataset.v === v));
}

function bindChoices(root) {
  root.querySelectorAll('[data-q]').forEach(g => {
    const q = g.dataset.q;
    const single = g.hasAttribute('data-single');
    g.addEventListener('click', e => {
      const b = e.target.closest('[data-v]');
      if (!b || !g.contains(b)) return;
      const v = b.dataset.v;
      if (single) {
        st[q] = v;
        markSel(q, v);
      } else {
        let a = st[q];
        if (q === 'color' && v === 'any') {
          a.length = 0;
          a.push('any');
        } else {
          if (q === 'color') {
            const i = a.indexOf('any');
            if (i > -1) a.splice(i, 1);
          }
          const i = a.indexOf(v);
          i > -1 ? a.splice(i, 1) : a.push(v);
        }
        g.querySelectorAll('[data-v]').forEach(x => x.classList.toggle('sel', a.includes(x.dataset.v)));
      }
    });
  });
}

function score(w) {
  let s = 0;
  const cols = st.color.length && !st.color.includes('any') ? st.color : null;
  if (cols) s += cols.includes(w.type) ? 40 : -30;
  else s += 10;
  if (st.food.length) s += Math.min(30, st.food.filter(f => w.food.includes(f)).length * 15);
  if (st.occ && w.occ.includes(st.occ)) s += 12;
  const t = st.taste;
  const d = (Math.abs(t.round - w.round) + Math.abs(t.body - w.body) + Math.abs(t.earthy - w.earthy) + Math.abs(t.sweet - w.sweet) * .5) / 3.5;
  s += 30 * (1 - d);
  if (st.region.length && st.region.includes(w.regionKey)) s += 14;
  if (st.style) s += 10 * (1 - Math.abs((st.style === 'classic' ? 1 : 0) - w.classic));
  return s;
}

function why(w) {
  const r = [];
  if (st.food.length) {
    const f = st.food.filter(x => w.food.includes(x)).map(x => FOOD_NAME[x]);
    if (f.length) r.push('past bij ' + f.join(' & '));
  }
  if (st.occ && w.occ.includes(st.occ)) r.push('ideaal als ' + st.occ);
  if (st.region.includes(w.regionKey)) r.push('jouw favoriete streek');
  if (st.style) {
    r.push(w.classic > .6
      ? (st.style === 'classic' ? 'klassieke waarde' : 'klassieker alternatief')
      : (st.style === 'adv' ? 'avontuurlijke keuze' : 'verrassende keuze'));
  }
  return r.length ? '✓ ' + r.join(' · ') : '✓ sluit aan bij je smaakprofiel';
}

function bottle(w) {
  if (w.image) return `<img src="${w.image}" alt="">`;
  const fills = { rood: '#6B1A26', wit: '#E8D9A0', rose: '#E3A9B2', bubbels: '#C9B36A', zoet: '#C4A35A' };
  const glass = fills[w.type] || '#6B1A26';
  const grape = (w.grape || '').split(/[&,]/)[0].trim().slice(0, 14);
  return `<svg viewBox="0 0 60 200" height="160" aria-hidden="true">
    <path d="M24 4h12v58c0 10 14 16 14 34v96a4 4 0 01-4 4H14a4 4 0 01-4-4V96c0-18 14-24 14-34z" fill="${glass}"/>
    <rect x="14" y="118" width="32" height="44" fill="#F4F1E6"/>
    <text x="30" y="138" font-size="5.2" text-anchor="middle" fill="#3A2A2A" font-family="Georgia,serif">VOORBEELD</text>
    <text x="30" y="150" font-size="5" text-anchor="middle" fill="#3A2A2A" font-family="Georgia,serif">${grape}</text>
  </svg>`;
}

function renderResult() {
  const ranked = WINES.map(w => ({ w, s: score(w) })).sort((a, b) => b.s - a.s);
  const top = ranked.slice(0, 3);
  const max = top[0] ? top[0].s : 1;
  st.picks = top.map(x => x.w);
  document.getElementById('res').innerHTML = top.map((x, i) => {
    const pct = Math.max(62, Math.round(98 * x.s / max - i * 4));
    const ex = x.w.example ? '<span class="ex">Voorbeeldwijn</span>' : '';
    const producer = (!x.w.example || (x.w.producer && x.w.producer.toLowerCase() !== 'voorbeeldwijn'))
      ? `<b>${x.w.producer}</b> · ` : '';
    return `<div class="rc${i === 0 ? ' best' : ''}">
      <span class="m">${pct}% match</span>
      <div class="pic">${bottle(x.w)}</div>
      <h3>${x.w.name}</h3>
      <div class="pr">${ex}${producer}${x.w.region} · ${x.w.grape} · ${COLOR_NAME[x.w.type] || x.w.type}</div>
      <div class="price">${x.w.price || '€ —'}</div>
      <p>${x.w.description}</p>
      <div class="why">${why(x.w)}</div>
    </div>`;
  }).join('');
}

function val(id) {
  const el = document.getElementById(id);
  return (el && el.value || '').trim();
}

function summary() {
  st.qty = parseInt(document.getElementById('qn').value, 10) || 6;
  return `<b>Selectie:</b> ${st.picks.map(w => w.name + ' (' + w.producer + ')').join(', ')}<br>` +
    `<b>Aantal:</b> ${st.qty} flessen · <b>Budget:</b> ${st.budget || 'geen voorkeur'} per fles<br>` +
    `<b>Gelegenheid:</b> ${st.occ || '–'} · <b>Gerecht:</b> ${st.food.map(f => FOOD_NAME[f]).join(', ') || '–'} · <b>Kleur:</b> ${st.color.map(c => COLOR_NAME[c] || 'verras me').join(', ') || '–'}`;
}

function renderOrder() {
  document.getElementById('sum').innerHTML = summary();
}

function flash() {
  const opts = document.querySelector('.step.on .opts');
  if (!opts || !opts.animate) return;
  opts.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
    { duration: 250 }
  );
}

function next() {
  const key = flow[idx];
  if (key === 'occ' && !st.occ) { flash(); return; }
  if (key === 'order') {
    let ok = true;
    ['f_name', 'f_mail'].forEach(i => {
      if (!val(i)) {
        document.getElementById(i).style.borderColor = 'var(--accent, #7A1F2B)';
        ok = false;
      } else {
        document.getElementById(i).style.borderColor = '';
      }
    });
    if (!ok) return;
    const txt = document.getElementById('sum').innerText +
      `\n\nNaam: ${val('f_name')}\nE-mail: ${val('f_mail')}\nTelefoon: ${val('f_tel')}\nLevering: ${val('f_lev')}\nOpmerking: ${val('f_note')}`;
    const subject = 'Bestelaanvraag via smaakquiz';
    document.getElementById('mailto').href =
      'mailto:' + SHOP.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(txt);
  }
  if (idx < flow.length - 1) { idx++; show(); }
}

function applyDemoAnswers() {
  st.occ = 'diner';
  markSel('occ', 'diner');
  st.food = ['wild', 'vlees'];
  document.querySelectorAll('[data-q="food"] [data-v]').forEach(b => b.classList.toggle('sel', st.food.includes(b.dataset.v)));
  st.color = ['rood'];
  document.querySelectorAll('[data-q="color"] [data-v]').forEach(b => b.classList.toggle('sel', st.color.includes(b.dataset.v)));
  st.region = [];
  st.style = 'classic';
  markSel('style', 'classic');
  st.budget = '20-40 euro';
  markSel('budget', '20-40 euro');
  st.taste = { round: .5, body: .7, earthy: .7, sweet: .05 };
}

function openFromHash() {
  const h = location.hash;
  if (!h.startsWith('#quiz')) return false;
  const m = h.match(/^#quiz-(\d+)$/);
  showQuiz();
  if (h === '#quiz-result' || h === '#quiz-order' || h === '#quiz-thanks') {
    applyDemoAnswers();
    if (h === '#quiz-thanks') {
      document.getElementById('f_name').value = 'Jan Peeters';
      document.getElementById('f_mail').value = 'jan@voorbeeld.be';
      idx = flow.indexOf('order');
      show();
      next();
      return true;
    }
    if (h === '#quiz-order') {
      idx = flow.indexOf('result');
      show();
      idx++;
      document.getElementById('f_name').value = 'Jan Peeters';
      document.getElementById('f_mail').value = 'jan@voorbeeld.be';
      show();
      return true;
    }
    idx = flow.indexOf('result');
    show();
    return true;
  }
  if (m) {
    const n = +m[1];
    applyDemoAnswers();
    idx = Math.max(0, Math.min(FLOW.length - 1, n - 1));
    show();
    return true;
  }
  startQuiz();
  return true;
}

fillShop();
renderRegions();
bindChoices(document);
document.querySelectorAll('[data-t]').forEach(r => r.addEventListener('input', () => { st.taste[r.dataset.t] = r.value / 100; }));
document.querySelectorAll('.qty [data-d]').forEach(b => {
  b.addEventListener('click', () => {
    const i = document.getElementById('qn');
    i.value = Math.max(1, (parseInt(i.value, 10) || 1) + parseInt(b.dataset.d, 10));
  });
});
document.getElementById('start').addEventListener('click', startQuiz);
document.getElementById('qnext').addEventListener('click', next);
document.getElementById('qskip').addEventListener('click', () => { idx++; show(); });
document.getElementById('qback').addEventListener('click', () => { if (idx > 0) { idx--; show(); } });
document.getElementById('qreset').addEventListener('click', resetQuiz);
window.addEventListener('hashchange', openFromHash);
if (!openFromHash()) showIntro();
