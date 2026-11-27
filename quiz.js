/* Copyright (c) 2026 Egbert Meseure. All rights reserved. */
if (/(?:^|[?&])shot=full(?:&|$)/.test(location.search)) document.documentElement.classList.add('shot-full');
/* Gedeelde quizlogica voor alle drie de stijlen.
   Verwacht: wines.js (SHOP, REGIONS, PRICE_TIERS, WINES) en de HTML van de stijlpagina's. */

const COLOR_NAME = { rood: 'Rood', wit: 'Wit', rose: 'Rosé', bubbels: 'Bubbels', zoet: 'Zoet' };
const FOOD_NAME = { vis: 'vis', vlees: 'vlees', wild: 'wild', kaas: 'kaas', veg: 'vegetarisch', dessert: 'dessert' };

function wineName(w) { return t('wine.' + w.id + '.name'); }
function wineDesc(w) {
  const d = t('wine.' + w.id + '.desc');
  const tail = t('wine.replace');
  return tail ? d + ' ' + tail : d;
}
function wineArea(w) { return w.areaKey ? t(w.areaKey) : w.region; }

function tasteLabels() {
  const out = [];
  const x = st.taste || {};
  if (x.round <= .35) out.push(t('taste.chip.fresh'));
  else if (x.round >= .65) out.push(t('taste.chip.round'));
  if (x.body <= .35) out.push(t('taste.chip.light'));
  else if (x.body >= .65) out.push(t('taste.chip.full'));
  if (x.earthy <= .35) out.push(t('taste.chip.fruit'));
  else if (x.earthy >= .65) out.push(t('taste.chip.earthy'));
  if (x.sweet >= .5) out.push(t('taste.chip.soft'));
  else if (x.sweet <= .2 && (x.round <= .35 || x.body <= .35)) out.push(t('taste.chip.dry'));
  // unique, max 2
  const seen = [];
  out.forEach(l => { if (!seen.includes(l)) seen.push(l); });
  return seen.slice(0, 2);
}

function renderAnswers() {
  const box = document.getElementById('answers');
  if (!box) return;
  const chips = [];
  const qIndex = key => Math.max(0, flow.indexOf(key));
  const past = (key) => idx > qIndex(key) || (idx >= qIndex(key) && flow[idx] !== key);
  // show a chip once the question has been answered / left
  if (st.occ) chips.push({ jump: 'occ', label: t('opt.occ.' + st.occ) });
  if (st.food.length) chips.push({ jump: 'food', label: st.food.map(f => t('opt.food.' + f)).join(' · ') });
  if (st.color.length) {
    const labs = st.color.map(c => t('opt.color.' + (c === 'any' ? 'any' : c)));
    chips.push({ jump: 'color', label: labs.join(' · ') });
  }
  if (idx > qIndex('taste') || flow[idx] === 'result' || flow[idx] === 'order' || flow[idx] === 'thanks') {
    const tl = tasteLabels();
    if (tl.length) chips.push({ jump: 'taste', label: tl.join(' · ') });
  }
  if (st.region.length) chips.push({ jump: 'region', label: st.region.map(r => t('region.' + r)).join(' · ') });
  if (st.style) chips.push({ jump: 'region', label: t('opt.style.' + st.style) });
  if (!chips.length || flow[idx] === 'thanks') {
    box.hidden = true;
    box.innerHTML = '';
    return;
  }
  box.hidden = false;
  box.innerHTML = chips.map(c =>
    `<button type="button" class="ans-chip" data-jump="${c.jump}">${c.label}</button>`
  ).join('');
}

const QUESTIONS = ['occ', 'food', 'color', 'taste', 'region'];
const FLOW = QUESTIONS.concat(['result', 'order', 'thanks']);

const st = {
  occ: null,
  food: [],
  color: [],
  region: [],
  style: null,
  taste: { round: .5, body: .5, earthy: .5, sweet: .2 },
  picks: [],
  qtys: {}
};

let flow = FLOW.slice(), idx = 0;

const intro = document.getElementById('intro');
const quizEl = document.getElementById('quiz');
const steps = [...document.querySelectorAll('.step')];

function fillShop() {
  document.querySelectorAll('[data-brand]').forEach(el => { el.textContent = t('shop.name'); });
  document.querySelectorAll('[data-email]').forEach(el => { el.textContent = SHOP.email; });
  const tmsg = document.getElementById('tmsg');
  if (tmsg) tmsg.textContent = t('thanks.body', { shop: t('shop.name') });
  const oh = document.getElementById('ohint');
  if (oh) oh.innerHTML = t('q.order.hint', { email: '<span data-email>' + SHOP.email + '</span>' });
}

function renderRegions() {
  const box = document.getElementById('region-chips');
  if (!box) return;
  box.innerHTML = REGIONS.map(r =>
    `<button type="button" class="chip" data-v="${r.key}">${t('region.' + r.key)}</button>`
  ).join('');
  box.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('sel', st.region.includes(b.dataset.v)));
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
  const stepNames = { occ: 'step.occ', food: 'step.food', color: 'step.color', taste: 'step.taste', region: 'step.region', result: 'step.result', order: 'step.order' };
  steps.forEach(s => {
    const sn = s.querySelector('.stepn');
    if (!sn || !stepNames[s.dataset.s]) return;
    const k = s.dataset.s;
    if (k === 'result' || k === 'order') sn.textContent = t(stepNames[k]);
    else sn.textContent = t('step.of', { n: QUESTIONS.indexOf(k) + 1, total: QUESTIONS.length, name: t(stepNames[k]) });
  });
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
    key === 'region' ? t('quiz.show') :
    key === 'result' ? t('quiz.order') :
    key === 'order' ? t('quiz.send') :
    t('quiz.next');
  const backBtn = document.getElementById('qback');
  if (backBtn) backBtn.textContent = t('quiz.back');
  const skipBtn = document.getElementById('qskip');
  if (skipBtn) skipBtn.textContent = t('quiz.skip');
  if (key === 'result') renderResult();
  if (key === 'order') renderOrder();
  updateCounts();
  renderAnswers();
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
  st.taste = { round: .5, body: .5, earthy: .5, sweet: .2 };
  st.picks = [];
  st.qtys = {};
  document.querySelectorAll('.opt.sel, .chip.sel').forEach(el => el.classList.remove('sel'));
  document.querySelectorAll('[data-t]').forEach(r => {
    r.value = r.dataset.t === 'sweet' ? 20 : 50;
  });
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
      updateCounts();
    });
  });
}

function snapshot() {
  return {
    occ: st.occ,
    food: st.food.slice(),
    color: st.color.slice(),
    region: st.region.slice(),
    style: st.style
  };
}

function hardMatch(w, s) {
  if (s.occ && !(w.occ || []).includes(s.occ)) return false;
  if (s.food && s.food.length && !s.food.some(f => (w.food || []).includes(f))) return false;
  const cols = s.color && s.color.length && !s.color.includes('any') ? s.color : null;
  if (cols && !cols.includes(w.type)) return false;
  if (s.region && s.region.length && !s.region.includes(w.regionKey)) return false;
  return true;
}

function countFor(q, v) {
  const s = snapshot();
  if (q === 'style') {
    return WINES.filter(w => hardMatch(w, s) && (v === 'classic' ? w.classic >= .55 : w.classic < .55)).length;
  }
  if (q === 'occ' || q === 'style') {
    s[q] = v;
  } else if (q === 'color' && v === 'any') {
    s.color = ['any'];
  } else {
    s[q] = [v];
  }
  return WINES.filter(w => hardMatch(w, s)).length;
}

function wineWord(n) {
  return n === 1 ? t('count.one') : t('count.many', { n: n });
}

function updateCounts() {
  document.querySelectorAll('[data-q] [data-v]').forEach(b => {
    const g = b.closest('[data-q]');
    if (!g) return;
    const n = countFor(g.dataset.q, b.dataset.v);
    let el = b.querySelector('.cnt');
    if (!el) {
      el = document.createElement('span');
      el.className = 'cnt';
      b.appendChild(el);
    }
    el.textContent = wineWord(n);
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
    const f = st.food.filter(x => w.food.includes(x)).map(x => t('opt.food.' + x));
    if (f.length) r.push(t('why.food', { food: f.join(' & ') }));
  }
  if (st.occ && w.occ.includes(st.occ)) r.push(t('why.occ', { occ: t('opt.occ.' + st.occ) }));
  if (st.region.includes(w.regionKey)) r.push(t('why.region'));
  if (st.style) {
    r.push(w.classic > .6
      ? (st.style === 'classic' ? t('why.classicYes') : t('why.classicAlt'))
      : (st.style === 'adv' ? t('why.advYes') : t('why.advAlt')));
  }
  return r.length ? '✓ ' + r.join(' · ') : '✓ ' + t('why.default');
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

function formatPrice(w) {
  const n = Number(w.price);
  if (!isFinite(n)) return w.price || '€ —';
  const s = '€ ' + n.toFixed(2).replace('.', ',');
  return w.example ? s + ' ' + t('label.examplePrice') : s;
}

function inTier(w, tier) {
  const n = Number(w.price);
  if (!isFinite(n)) return false;
  return n >= tier.min && n < tier.max;
}

function wineCard(x, maxInTier) {
  const pct = Math.max(62, Math.round(98 * x.s / (maxInTier || x.s || 1)));
  const ex = x.w.example ? '<span class="ex">' + t('label.exampleWine') + '</span>' : '';
  const producer = (!x.w.example || (x.w.producer && x.w.producer.toLowerCase() !== 'voorbeeldwijn'))
    ? `<b>${x.w.producer}</b> · ` : '';
  return `<div class="rc">
    <span class="m">${t('label.match', { pct: pct })}</span>
    <div class="pic">${bottle(x.w)}</div>
    <h3>${wineName(x.w)}</h3>
    <div class="pr">${ex}${producer}${wineArea(x.w)} · ${x.w.grape} · ${t('opt.color.' + x.w.type)}</div>
    <div class="price">${formatPrice(x.w)}</div>
    <p>${wineDesc(x.w)}</p>
    <div class="why">${why(x.w)}</div>
  </div>`;
}

function renderResult() {
  const matched = WINES.filter(w => hardMatch(w, st)).map(w => ({ w, s: score(w) })).sort((a, b) => b.s - a.s);
  const picks = [];
  const html = (PRICE_TIERS || []).map(tier => {
    const list = matched.filter(x => inTier(x.w, tier));
    const top = list.slice(0, 2);
    top.forEach(x => picks.push(x.w));
    const max = list[0] ? list[0].s : 1;
    const body = top.length
      ? top.map(x => wineCard(x, max)).join('')
      : '<p class="tier-empty">' + t('tier.empty') + '</p>';
    const more = list.length > 2 ? `<p class="tier-more">${t('tier.more', { n: list.length })}</p>` : '';
    return `<div class="tier">
      <div class="tier-head"><h3>${t('tier.' + tier.key)}</h3><span>${t('tier.example')}</span></div>
      ${body}${more}
    </div>`;
  }).join('');
  st.picks = picks;
  Object.keys(st.qtys).forEach(id => {
    if (!picks.some(w => w.id === id)) delete st.qtys[id];
  });
  document.getElementById('res').innerHTML = html;
}

function val(id) {
  const el = document.getElementById(id);
  return (el && el.value || '').trim();
}

function selectedOrderLines() {
  return st.picks.map(w => ({ w, qty: Math.max(0, parseInt(st.qtys[w.id], 10) || 0) })).filter(x => x.qty > 0);
}

function summary() {
  const lines = selectedOrderLines();
  const list = lines.length
    ? lines.map(x => wineName(x.w) + ' × ' + x.qty + ' (' + formatPrice(x.w) + ')').join(', ')
    : t('order.summary.none');
  const total = lines.reduce((n, x) => n + x.qty, 0);
  const bottles = total === 1 ? t('order.bottle.one') : t('order.bottle.many', { n: total });
  const food = st.food.map(f => t('opt.food.' + f)).join(', ') || '–';
  const color = st.color.map(c => t('opt.color.' + (c === 'any' ? 'any' : c))).join(', ') || '–';
  return `<b>${t('order.summary.sel')}:</b> ${list}<br>` +
    `<b>${t('order.summary.qty')}:</b> ${bottles}<br>` +
    `<b>${t('order.summary.occ')}:</b> ${st.occ ? t('opt.occ.' + st.occ) : '–'} · <b>${t('order.summary.food')}:</b> ${food} · <b>${t('order.summary.color')}:</b> ${color}`;
}

function renderOrder() {
  const box = document.getElementById('order-qtys');
  st.picks.forEach(w => {
    if (st.qtys[w.id] == null) st.qtys[w.id] = 1;
  });
  if (!box) return;
  if (!st.picks.length) {
    box.innerHTML = '<p class="ow-empty">' + t('order.empty') + '</p>';
  } else {
    box.innerHTML = '<div class="sub2">' + t('order.qtyTitle') + '</div>' + st.picks.map(w =>
      `<div class="ow">
        <div class="ow-info"><strong>${wineName(w)}</strong><span>${w.example ? t('label.exampleWine') + ' · ' : ''}${formatPrice(w)}</span></div>
        <div class="qty" data-id="${w.id}">
          <button type="button" data-d="-1" aria-label="${t('form.less')}">−</button>
          <input value="${st.qtys[w.id]}" inputmode="numeric" aria-label="${t('form.qtyOf', { name: wineName(w) })}">
          <button type="button" data-d="1" aria-label="${t('form.more')}">+</button>
        </div>
      </div>`
    ).join('');
  }
  document.getElementById('sum').innerHTML = summary();
}

function setQty(id, n) {
  st.qtys[id] = Math.max(0, n);
  const input = document.querySelector(`.qty[data-id="${id}"] input`);
  if (input) input.value = st.qtys[id];
  const sum = document.getElementById('sum');
  if (sum) sum.innerHTML = summary();
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
    if (!selectedOrderLines().length) ok = false;
    if (!ok) return;
    const txt = document.getElementById('sum').innerText +
      `\n\nNaam: ${val('f_name')}\nE-mail: ${val('f_mail')}\nTelefoon: ${val('f_tel')}\nLevering: ${val('f_lev')}\nOpmerking: ${val('f_note')}`;
    const subject = t('mail.subject');
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
      idx = flow.indexOf('result');
      show();
      idx = flow.indexOf('order');
      show();
      next();
      return true;
    }
    if (h === '#quiz-order') {
      idx = flow.indexOf('result');
      show();
      idx = flow.indexOf('order');
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
    idx = Math.max(0, Math.min(QUESTIONS.length - 1, n - 1));
    show();
    return true;
  }
  startQuiz();
  return true;
}

window.onLangChange = function () {
  fillShop();
  renderRegions();
  if (document.body.classList.contains('quiz-on')) show();
};

const answersBox = document.getElementById('answers');
if (answersBox) {
  answersBox.addEventListener('click', e => {
    const b = e.target.closest('[data-jump]');
    if (!b) return;
    const i = flow.indexOf(b.dataset.jump);
    if (i >= 0) { idx = i; show(); }
  });
}

fillShop();
renderRegions();
bindChoices(document);
document.querySelectorAll('[data-t]').forEach(r => r.addEventListener('input', () => { st.taste[r.dataset.t] = r.value / 100; }));
const orderBox = document.getElementById('order-qtys');
if (orderBox) {
  orderBox.addEventListener('click', e => {
    const btn = e.target.closest('[data-d]');
    if (!btn) return;
    const wrap = btn.closest('.qty');
    if (!wrap || !wrap.dataset.id) return;
    const cur = parseInt(st.qtys[wrap.dataset.id], 10) || 0;
    setQty(wrap.dataset.id, cur + parseInt(btn.dataset.d, 10));
  });
  orderBox.addEventListener('change', e => {
    const input = e.target.closest('.qty input');
    if (!input) return;
    const wrap = input.closest('.qty');
    if (!wrap || !wrap.dataset.id) return;
    setQty(wrap.dataset.id, parseInt(input.value, 10) || 0);
  });
}
document.getElementById('start').addEventListener('click', startQuiz);
document.getElementById('qnext').addEventListener('click', next);
document.getElementById('qskip').addEventListener('click', () => { idx++; show(); });
document.getElementById('qback').addEventListener('click', () => { if (idx > 0) { idx--; show(); } });
document.getElementById('qreset').addEventListener('click', resetQuiz);
window.addEventListener('hashchange', openFromHash);
if (!openFromHash()) showIntro();
