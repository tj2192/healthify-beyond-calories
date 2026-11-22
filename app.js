/* ==========================================================================
   Healthify — beyond calories
   Interactive prototype of the Food Insight flows.
   Vanilla JS, no build step. State in `st`, one render(), event delegation
   on [data-act]. Same architecture as the Ria chat prototype next door.
   ========================================================================== */

/* --------------------------------- icons --------------------------------- */
const S = (d, w = 22, extra = '') =>
  `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;

const I = {
  back:    w => S('<path d="M15 5l-7 7 7 7"/>', w),
  chevR:   w => S('<path d="M9 5l7 7-7 7"/>', w),
  chevD:   w => S('<path d="M6 9.5l6 6 6-6"/>', w),
  close:   w => S('<path d="M6 6l12 12M18 6L6 18"/>', w),
  dotsV:   w => S('<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>', w),
  dotsH:   w => S('<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>', w),
  plus:    w => S('<path d="M12 5v14M5 12h14"/>', w),
  check:   w => S('<path d="M5 12.5l4.5 4.5L19 7"/>', w, 'stroke-width="2.1"'),
  info:    w => S('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>', w),
  chart:   w => S('<path d="M4 20h16"/><path d="M7 16v-4M12 16V8M17 16V5"/>', w),
  spark:   w => S('<path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>', w),
  camera:  w => S('<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2h5.6l1.5 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>', w),
  doc:     w => S('<path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4"/>', w),
  book:    w => S('<path d="M5 5a2 2 0 0 1 2-2h11v16H7a2 2 0 0 0-2 2z"/><path d="M9 7h6M9 11h4"/>', w),
  heart:   w => S('<path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.6 12 20 12 20z"/>', w),
  leaf:    w => S('<path d="M20 4C10 4 4 8.5 4 15a5 5 0 0 0 5 5c6.5 0 11-6 11-16z"/><path d="M8.5 16.5C11 13 14 11 17 10"/>', w),
  chat:    w => S('<path d="M20 12a7 7 0 0 1-7 7H8l-4 2 1.2-3.4A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7z"/>', w),
  mic:     w => S('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>', w),
  ext:     w => S('<path d="M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4"/>', w),
  trash:   w => S('<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>', w),
  pencil:  w => S('<path d="M5 19h3l10-10-3-3L5 16z"/><path d="M14.5 6.5l3 3"/>', w),
  utensils:w => S('<path d="M6 3v7a2 2 0 0 0 2 2v9"/><path d="M10 3v7a2 2 0 0 1-2 2"/><path d="M17 21V3c-2 1-3 3.5-3 7h3"/>', w),
  swap:    w => S('<path d="M4 8h12l-3-3M20 16H8l3 3"/>', w),
  bell:    w => S('<path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z"/><path d="M10 18a2 2 0 0 0 4 0"/>', w),

  /* flag glyphs */
  shaker:  w => S('<path d="M9 9h6l1 11H8z"/><path d="M9.5 9V6a2.5 2.5 0 0 1 5 0v3"/><path d="M11 4.5h2"/>', w),
  drop:    w => S('<path d="M12 3.5s5.5 6 5.5 9.8A5.5 5.5 0 0 1 6.5 13.3C6.5 9.5 12 3.5 12 3.5z"/>', w),
  layers:  w => S('<path d="M12 4l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 16l8 4 8-4"/>', w),
  cube:    w => S('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>', w),

  /* food glyphs, used inside the gradient tiles */
  bag:     w => S('<path d="M7 7h10l1.4 13H5.6z"/><path d="M8.5 7V5.5h7V7"/><path d="M9.5 11.5h5"/>', w),
  slab:    w => S('<rect x="4" y="7" width="16" height="10" rx="2"/><path d="M4 11.5h16M4 14h16"/>', w),
  wedge:   w => S('<path d="M4 18a14 14 0 0 1 16 0z"/><path d="M8.5 16.5h.01M12 15h.01M15.5 16.5h.01"/>', w),
  bowl:    w => S('<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M8 8.5c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5"/>', w),
  bar:     w => S('<rect x="4" y="8" width="16" height="8" rx="2.5"/><path d="M8.5 8v8M13 8v8"/>', w),
  cup:     w => S('<path d="M6 8h11v7a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/>', w),
  stick:   w => S('<rect x="7" y="3.5" width="10" height="12" rx="4"/><path d="M12 15.5V21"/>', w),
};

/* --------------------------- tiles (stand-in art) ------------------------- */
/* The uploaded board uses product photography. This prototype has no rights to
   those images, so every food is drawn as a tinted tile with a glyph. Swap in
   real photos and nothing else about the layout changes. */
const TONE = {
  chips:   ['#FFE7A8', '#F0A631', 'bag'],
  ice:     ['#F7E3D0', '#D7A57E', 'slab'],
  melon:   ['#FFD9DC', '#F08092', 'wedge'],
  baked:   ['#E9F0CE', '#AAC45A', 'bag'],
  makhana: ['#FFF0CF', '#E6BD62', 'bowl'],
  multi:   ['#F1E2C9', '#C69B5F', 'bag'],
  yog:     ['#E4EFF8', '#9ABBDB', 'stick'],
  kulfi:   ['#FFECD7', '#ECB677', 'stick'],
  choc:    ['#E7DBD2', '#9A7761', 'bar'],
  mango:   ['#FFEFC2', '#F3B63D', 'cup'],
  banana:  ['#FDF3C9', '#E4CA55', 'cup'],
  dates:   ['#EBDCD2', '#A67F66', 'bowl'],
  corn:    ['#FFF1C6', '#EDBF49', 'bowl'],
  potato:  ['#FFE9C0', '#E69F3B', 'bar'],
};
/* Photos come in two kinds. A packshot arrives on a white background, so it is
   contained on a near-white tile; a full-bleed food photo fills the tile. */
function tile(tone, size, cls = '', img) {
  const [a, b, g] = TONE[tone] || TONE.chips;
  if (img) {
    const kind = img.fit === 'cover' ? 'tile--cover' : 'tile--photo';
    // If the file is not there yet the drawn glyph comes back, so a missing
    // asset degrades instead of leaving a broken image in the phone.
    return `<span class="tile ${kind} ${cls}" style="--a:${a};--b:${b};width:${size}px;height:${size}px">
      <span class="tile__fb">${I[g](Math.round(size * 0.52))}</span>
      <img src="${img.src}" alt=""
        onerror="this.closest('.tile').classList.add('tile--noimg');this.remove()"></span>`;
  }
  return `<span class="tile ${cls}" style="--a:${a};--b:${b};width:${size}px;height:${size}px">
    ${I[g](Math.round(size * 0.52))}</span>`;
}

/* --------------------------------- foods --------------------------------- */
const FOODS = {
  chips: {
    name: 'Lays Chilli Chips', kind: 'Packaged snack', tone: 'chips', img: { src: 'assets/lays.webp', fit: 'contain' },
    base: 30, per: { cal: 121, p: 6.5, f: 2.7, c: 17 },
    units: [
      { id: 'g', label: 'Grams', size: 1, opts: [10, 15, 20, 25, 30, 40, 50, 60, 75, 100] },
      { id: 'pack', label: 'Packet (30 g)', size: 30, opts: [0.5, 1, 1.5, 2] },
    ],
  },
  // Not in the seeded log any more, but kept whole: add an entry with
  // food:'ice' to put the second insight set back in play.
  ice: {
    name: 'Ice Cream Sandwich, Cream Bell', short: 'Ice Cream Sandwich', kind: 'Frozen dessert', tone: 'ice',
    base: 1, per: { cal: 310, p: 4, f: 14, c: 42 },
    units: [{ id: 'piece', label: 'Piece', size: 1, opts: [0.5, 1, 1.5, 2, 3] }],
  },
  melon: {
    name: 'Melon, Water', short: 'Watermelon', kind: 'Whole fruit', tone: 'melon',
    img: { src: 'assets/melon.webp', fit: 'cover' },
    base: 1, per: { cal: 46, p: 0.9, f: 0.2, c: 11.5 },
    units: [{ id: 'cup', label: 'Cup, balls', size: 1, opts: [0.5, 1, 1.5, 2] }],
  },
};

/* ------------------------------- insights -------------------------------- */
/* One entry per food that has something worth saying. A food missing from here
   is a food Ria stays quiet about — see `melon`. */
const INSIGHT = {
  chips: {
    why: 'Regular intake of high-sodium and high-saturated fat foods can affect heart health over time and may not be ideal for daily consumption.',
    flags: [
      { id: 'sodium', t: 'High in sodium', ico: 'shaker',
        p: 'Packaged snacks often contain added sodium, both for taste and for a longer shelf life. One 30 g packet carries roughly a sixth of a day&rsquo;s sensible limit.',
        why: 'Too much sodium over time can raise blood pressure and increase the risk of heart-related issues.',
        do: ['Look for lower-sodium options.', 'Keep it occasional.'] },
      { id: 'satfat', t: 'Contains saturated fat', ico: 'drop',
        p: 'Chips are fried, so a good share of the calories arrives as fat &mdash; and part of that fat is saturated.',
        why: 'Saturated fat raises LDL cholesterol, which builds up in the arteries over the years.',
        do: ['Baked or air-fried versions cut most of it.', 'Balance it against the rest of the day.'] },
      { id: 'proc', t: 'Highly processed food', ico: 'layers',
        p: 'This is refined starch with added salt, oil and flavouring. Very little of the original potato is still doing any work.',
        why: 'Highly processed foods are quick to eat and do not keep you full, so the portion tends to creep up.',
        do: ['Pair it with something whole &mdash; fruit, curd, nuts.', 'Tip it into a bowl instead of eating from the packet.'] },
    ],
    picks: [
      { id: 'baked', name: 'Too Yumm! Baked Chips', meta: '~90 Cal / 30 g', tone: 'baked',
        img: { src: 'assets/too-yumm.webp', fit: 'contain' },
        per: { cal: 90, p: 2, f: 2.4, c: 15.5 } },
      { id: 'makhana', name: 'Roasted Makhana', meta: '~90 Cal / 30 g', tone: 'makhana',
        img: { src: 'assets/makhana.jpg', fit: 'cover' },
        per: { cal: 90, p: 3.2, f: 0.3, c: 18 } },
      { id: 'multi', name: 'Multigrain Chips', meta: '~100 Cal / 30 g', tone: 'multi',
        img: { src: 'assets/multigrain.jpg', fit: 'contain' },
        per: { cal: 100, p: 2.6, f: 3.4, c: 15 } },
    ],
    recipes: [
      { id: 'r-makhana', name: 'Roasted Makhana', sub: 'A crunchy, low-fat snack', tone: 'makhana',
        img: { src: 'assets/makhana.jpg', fit: 'cover' },
        time: '10 min', cal: '~90 Cal / 30 g',
        why: 'Puffed lotus seeds dry-roasted with a little ghee. All of the crunch, none of the frying.',
        steps: ['Dry-roast 30 g makhana on a low flame until it snaps when pressed.',
                'Add half a teaspoon of ghee, chilli powder and salt.',
                'Toss for a minute and cool before storing.'] },
      { id: 'r-corn', name: 'Masala Corn Chaat', sub: 'A flavourful, fiber-rich snack', tone: 'corn',
        img: { src: 'assets/corn-chaat.jpg', fit: 'cover' },
        time: '12 min', cal: '~120 Cal / bowl',
        why: 'Sweetcorn gives you the salty, tangy hit of a packet snack with fibre attached.',
        steps: ['Steam a cup of sweetcorn until tender.',
                'Toss with chopped onion, tomato and coriander.',
                'Finish with lemon, chaat masala and a pinch of salt.'] },
      { id: 'r-wedge', name: 'Air-fried Potato Wedges', sub: 'A lighter take on crispy chips', tone: 'potato',
        img: { src: 'assets/potato-wedges.webp', fit: 'cover' },
        time: '25 min', cal: '~140 Cal / serving',
        why: 'Same potato, same crunch, about a third of the oil &mdash; and you control the salt.',
        steps: ['Cut one potato into wedges and soak for 10 minutes.',
                'Pat dry, toss with a teaspoon of oil, paprika and pepper.',
                'Air-fry at 190&deg;C for 15 minutes, shaking once.'] },
    ],
  },
  ice: {
    why: 'A dessert like this is mostly added sugar and cream. On its own that is fine &mdash; as a daily breakfast item it quietly takes up a fifth of the day before anything nourishing arrives.',
    flags: [
      { id: 'sugar', t: 'High in added sugar', ico: 'cube',
        p: 'Around 24 g of the carbohydrate here is added sugar &mdash; roughly six teaspoons in one sandwich.',
        why: 'Added sugar spikes blood glucose and adds calories without protein, fibre or micronutrients to show for it.',
        do: ['Move it to after a meal rather than as one.', 'Half a portion still tastes like dessert.'] },
      { id: 'satfat2', t: 'Contains saturated fat', ico: 'drop',
        p: 'Dairy fat and the biscuit shell together make this about 14 g of fat, much of it saturated.',
        why: 'Saturated fat raises LDL cholesterol, which builds up in the arteries over the years.',
        do: ['Frozen yoghurt or kulfi made with milk is lighter.', 'Keep the rest of the day lean.'] },
      { id: 'proc2', t: 'Highly processed food', ico: 'layers',
        p: 'Refined flour, sugar, vegetable fat, emulsifiers and flavouring &mdash; assembled rather than cooked.',
        why: 'Highly processed foods are quick to eat and do not keep you full, so the portion tends to creep up.',
        do: ['Fruit-based frozen desserts do the same job.', 'Eat it slowly, off a plate.'] },
    ],
    picks: [
      { id: 'yog', name: 'Frozen Yoghurt Bar', meta: '~110 Cal / 1 pc', tone: 'yog',
        per: { cal: 110, p: 3.5, f: 2.5, c: 19 } },
      { id: 'kulfi', name: 'Fruit &amp; Nut Kulfi', meta: '~150 Cal / 1 pc', tone: 'kulfi',
        per: { cal: 150, p: 4, f: 7, c: 18 } },
      { id: 'choc', name: 'Dark Chocolate', meta: '~95 Cal / 2 sq', tone: 'choc',
        per: { cal: 95, p: 1.2, f: 7, c: 7 } },
    ],
    recipes: [
      { id: 'r-mango', name: 'Frozen Mango Yoghurt', sub: 'Blended fruit, no added sugar', tone: 'mango',
        time: '5 min + freeze', cal: '~120 Cal / cup',
        why: 'Ripe mango is sweet enough on its own, and the curd brings protein the sandwich never had.',
        steps: ['Blend a cup of frozen mango with half a cup of thick curd.',
                'Add a squeeze of lime; taste before adding anything sweet.',
                'Freeze for two hours, then scrape with a fork.'] },
      { id: 'r-banana', name: 'Banana Nice Cream', sub: 'Two ingredients, naturally sweet', tone: 'banana',
        time: '5 min', cal: '~130 Cal / cup',
        why: 'Frozen banana whips up like soft-serve. Nothing else is doing the sweetening.',
        steps: ['Freeze two sliced ripe bananas overnight.',
                'Blend with a splash of milk until it turns creamy.',
                'Eat straight away, or freeze for 20 minutes to firm up.'] },
      { id: 'r-dates', name: 'Dates &amp; Nut Bites', sub: 'Chewy, fibre-rich, freezer-friendly', tone: 'dates',
        time: '15 min', cal: '~90 Cal / piece',
        why: 'Dessert that behaves like a snack &mdash; fibre and fat slow the sugar right down.',
        steps: ['Pulse 10 pitted dates with a handful of almonds.',
                'Roll into bite-sized balls.',
                'Chill for an hour; keeps a fortnight in the freezer.'] },
    ],
  },
};

const SLOTS = [
  { name: 'Breakfast', target: 375 },
  { name: 'Morning Snack', target: 188 },
  { name: 'Lunch', target: 450 },
];
const DAY_TARGET = 1500;

/* --------------------------------- state --------------------------------- */
function freshState() {
  return {
    screen: 'log',
    back: false,
    sheet: null,            // {kind:'flag'|'recipe'|'menu', id}
    tab: 'picks',           // inside Food Insight
    food: 'chips',          // the food the detail / insight / chat screens are about
    draft: null,            // {qty, unit} while editing on the detail screen
    entries: [
      { id: 'e2', slot: 'Breakfast', food: 'chips', qty: 30, unit: 'g' },
      { id: 'e3', slot: 'Morning Snack', food: 'melon', qty: 1, unit: 'cup', planned: true },
    ],
    swapped: {},            // entryId -> pick id, so the log can show what changed
    messages: [], msgSeq: 0, typing: false, composer: '',
    bodyScroll: 0,
    undo: null,
  };
}
let st = freshState();
let entrySeq = 3;

/* -------------------------------- helpers -------------------------------- */
const app = () => document.getElementById('app');
const ov = () => document.getElementById('overlay');
const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const r0 = n => Math.round(n);
const fmt = n => r0(n).toLocaleString('en-US');
const one = n => (Math.round(n * 10) / 10).toFixed(1);

function foodOf(e) { return e.pick ? e.pick : FOODS[e.food]; }
function unitOf(e) {
  const f = FOODS[e.food];
  return (f.units.find(u => u.id === e.unit) || f.units[0]);
}
/* Macros scale with how much of the base amount the entry holds. */
function factor(e) {
  const f = FOODS[e.food];
  return (e.qty * unitOf(e).size) / f.base;
}
function macros(e) {
  const src = e.pick ? e.pick.per : FOODS[e.food].per;
  const k = e.pick ? e.qty : factor(e);
  return { cal: src.cal * k, p: src.p * k, f: src.f * k, c: src.c * k };
}
function entryName(e) { return e.pick ? e.pick.name : FOODS[e.food].name; }
function entryTone(e) { return e.pick ? e.pick.tone : FOODS[e.food].tone; }
function entrySub(e) {
  if (e.pick) return e.pick.meta;
  const u = unitOf(e);
  const label = u.id === 'g' ? 'grams' : u.id === 'pack' ? (e.qty === 1 ? 'packet' : 'packets')
    : u.id === 'piece' ? (e.qty === 1 ? 'piece' : 'pieces') : 'cup, balls';
  return `${one(e.qty)} ${label}`;
}
/* The tight form used in headers and the chat context card: "30 g", "1 piece". */
function compactSub(e) {
  if (e.pick) return e.pick.meta.replace(/^~[\d]+ Cal \/ /, '');
  const n = e.qty % 1 === 0 ? String(e.qty) : one(e.qty);
  return { g: `${n} g`, pack: `${n} packet`, piece: `${n} piece`, cup: `${n} cup` }[unitOf(e).id] || `${n}`;
}

/* A food gets a nudge only when there is something to say about it, and only
   while it still is that food — swap it out and the nudge goes with it. */
function flagsFor(e) { return (!e.pick && INSIGHT[e.food]) ? INSIGHT[e.food].flags : null; }
function entryById(id) { return st.entries.find(e => e.id === id); }
function slotEntries(name) { return st.entries.filter(e => e.slot === name); }
function slotEaten(name) {
  return slotEntries(name).filter(e => !e.planned).reduce((n, e) => n + macros(e).cal, 0);
}
function dayEaten() { return st.entries.filter(e => !e.planned).reduce((n, e) => n + macros(e).cal, 0); }

/* =============================== rendering =============================== */
function render(opts = {}) {
  // A re-render of the screen you are already on should not throw away where
  // you had scrolled to; only a move to another screen starts at the top.
  const prev = document.querySelector('.screen');
  const prevBody = document.querySelector('.body');
  const keep = (prev && prev.dataset.screen === st.screen && prevBody) ? prevBody.scrollTop : null;

  const html = st.screen === 'log' ? viewLog()
    : st.screen === 'food' ? viewFood()
    : st.screen === 'insight' ? viewInsight()
    : viewChat();
  const cls = `screen${opts.animate === false ? '' : ' screen--enter'}${st.back ? ' screen--back' : ''}`;
  app().innerHTML = `<section class="${cls}" data-screen="${st.screen}">${html}</section>`;
  st.back = false;
  renderOverlay();
  afterPaint(keep);
  document.getElementById('crumb').textContent = crumbText();
  renderGuide();
}

function crumbText() {
  if (st.sheet && st.sheet.kind === 'flag') return 'Flag detail';
  if (st.sheet && st.sheet.kind === 'recipe') return 'Recipe';
  return { log: 'Food log', food: 'Food detail', insight: 'Food Insight', chat: 'Ria' }[st.screen];
}

function afterPaint(keep) {
  if (keep != null) {
    const body = document.querySelector('.body');
    if (body) body.scrollTop = keep;
  }
  const thread = document.querySelector('.thread');
  if (thread) {
    const pin = () => { thread.scrollTop = thread.scrollHeight; };
    pin(); requestAnimationFrame(pin); setTimeout(pin, 200); setTimeout(pin, 440);
  }
  st.messages.forEach(m => { m.seen = true; });
}

function renderOverlay() {
  const host = ov();
  host.innerHTML = !st.sheet ? ''
    : st.sheet.kind === 'flag' ? viewFlagSheet()
    : st.sheet.kind === 'recipe' ? viewRecipeSheet()
    : viewMenuSheet();
  const sb = document.querySelector('.statusbar');
  sb.classList.toggle('on-dark', false);
}

/* --------------------------------- nav ----------------------------------- */
function nav(opts) {
  return `<div class="nav">
    ${opts.back === false ? '<span style="width:44px"></span>'
      : `<button class="iconbtn press" data-act="back" aria-label="Back">${I.back(22)}</button>`}
    ${opts.title ? `<div class="nav__t">${opts.title}</div>` : ''}
    ${opts.center || ''}
    <div class="nav__r">${opts.right || '<span style="width:44px"></span>'}</div>
  </div>`;
}

/* ------------------------------- 01 food log ------------------------------ */
function viewLog() {
  const eaten = dayEaten();
  const pct = Math.min(1, eaten / DAY_TARGET);
  const c = 2 * Math.PI * 20;

  return `
  ${nav({
    back: true,
    center: `<button class="nav__sel press" data-act="dead" data-what="The day picker">Today ${I.chevD(18)}</button>`,
    right: `<button class="iconbtn press" data-act="dead" data-what="Weekly insights" aria-label="Insights">${I.chart(21)}</button>`,
  })}
  <div class="body">
    <div class="card sum">
      <span class="ring">
        <svg class="ring__arc" width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" stroke="#F0E3D2" stroke-width="4" fill="none"/>
          <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" fill="none"
            stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct)}"/>
        </svg>
        ${I.utensils(19)}
      </span>
      <span>
        <b class="sum__t">${fmt(eaten)} of ${fmt(DAY_TARGET)} Cal</b>
        <span class="sum__s">Cal Eaten</span>
      </span>
      <button class="sqbtn press" data-act="dead" data-what="The calorie breakdown" aria-label="Breakdown">${I.chart(17)}</button>
    </div>

    <div class="tabs">
      <button class="tchip tchip--on press" data-act="dead" data-what="Diet Plan">${I.doc(16)}Diet Plan</button>
      <button class="tchip press" data-act="dead" data-what="Insights">${I.chart(16)}Insights</button>
      <button class="tchip press" data-act="dead" data-what="Recipes">${I.bowl(16)}Recipes</button>
    </div>

    ${SLOTS.map(slotBlock).join('')}
  </div>
  <button class="snap press" data-act="dead" data-what="Snap">${I.camera(20)}Snap</button>`;
}

function slotBlock(slot) {
  const rows = slotEntries(slot.name);
  const eaten = slotEaten(slot.name);
  // One nudge per meal, not one per item: the log should read like a log.
  const flagged = rows.filter(flagsFor);
  const nudgeId = flagged.length ? flagged[flagged.length - 1].id : null;
  const over = eaten > slot.target;

  return `
  <div class="sechead">
    <h3>${slot.name}</h3>
    <span class="sechead__m" style="${over ? 'color:var(--orange-ink)' : ''}">${fmt(eaten)} of ${fmt(slot.target)} Cal</span>
    <button class="addbtn press" data-act="dead" data-what="Adding a food" aria-label="Add to ${slot.name}">${I.plus(15)}</button>
  </div>
  ${rows.length === 0 ? `
    <div class="card" style="padding:16px 14px;font-size:13.5px;color:var(--muted)">Nothing logged yet.</div>`
  : `<div class="card list">
      ${rows.map((e, i) => entryRow(e, i === rows.length - 1 && !hasTail(slot), e.id === nudgeId)).join('')}
      ${slot.name === 'Breakfast' ? `
        <div class="hr"></div>
        <button class="rowlink press" data-act="dead" data-what="Save as Meal">Save as Meal ${I.chevR(18)}</button>` : ''}
    </div>`}`;
}
function hasTail(slot) { return slot.name === 'Breakfast'; }

function entryRow(e, last, nudge) {
  const flags = nudge && flagsFor(e);
  const m = macros(e);

  if (e.planned) {
    // Still openable: this is where the prototype shows Ria staying quiet.
    return `
    <button class="plan press" style="padding-left:0;padding-right:0;width:100%;border:0;background:0;text-align:left;font:inherit;color:inherit"
      data-act="open-food" data-id="${e.id}">
      <span class="plan__bar"></span>
      ${tile(entryTone(e), 44, '', e.pick ? null : FOODS[e.food].img)}
      <span>
        <span class="plan__n">${entryName(e)}</span>
        <span class="plan__s">${entrySub(e)} &bull; ${fmt(m.cal)} Cal</span>
      </span>
      <span class="chip chip--ai" style="margin-left:auto">Planned</span>
      <span style="color:var(--muted-2);flex:0 0 auto">${I.chevR(17)}</span>
    </button>`;
  }

  return `
  <div>
    <div style="display:flex;align-items:center;gap:0">
      <button class="erow press" data-act="open-food" data-id="${e.id}">
        <span>
          <span class="erow__n">${entryName(e)}</span>
          <span class="erow__s">${entrySub(e)}</span>
        </span>
        <span class="erow__c">${fmt(m.cal)} Cal</span>
      </button>
      <button class="erow__d press" data-act="row-menu" data-id="${e.id}" aria-label="More for ${esc(entryName(e))}">${I.dotsV(18)}</button>
    </div>
    ${st.swapped[e.id] ? `<div style="margin:-4px 0 12px"><span class="chip chip--new">${I.check(12)}Swapped in</span></div>` : ''}
    ${flags ? `
      <button class="nudge press" data-act="open-food" data-id="${e.id}" data-jump="1">
        ${I.spark(18)}
        <span>
          <span class="nudge__t">Calories aren&rsquo;t the full picture</span>
          <span class="nudge__s">Get a Food Insight with Ria</span>
        </span>
        <span class="nudge__x">${I.chevR(18)}</span>
      </button>` : ''}
    ${last ? '' : '<div class="hr"></div>'}
  </div>`;
}

/* ----------------------------- 02 food detail ----------------------------- */
function viewFood() {
  const e = entryById(st.draft.id);
  const f = FOODS[e.food];
  const d = st.draft;
  const u = f.units.find(x => x.id === d.unit) || f.units[0];
  const k = (d.qty * u.size) / f.base;
  const m = { cal: f.per.cal * k, p: f.per.p * k, f: f.per.f * k, c: f.per.c * k };
  const changed = d.qty !== e.qty || d.unit !== e.unit;
  const ins = INSIGHT[e.food];
  const [a, b, g] = TONE[f.tone];

  return `
  ${nav({ right: `<button class="iconbtn press" data-act="row-menu" data-id="${e.id}" aria-label="More">${I.dotsH(21)}</button>` })}
  <div class="body body--short">
    <div class="hero ${f.img ? (f.img.fit === 'cover' ? 'hero--cover' : 'hero--photo') : ''}"
      ${f.img ? '' : `style="background:linear-gradient(150deg,${a},${b})"`}>
      ${f.img
        ? `<img class="hero__img" src="${f.img.src}" alt=""
             onerror="this.closest('.hero').classList.add('hero--noimg');this.remove()">`
        : `<span style="position:absolute;right:14px;top:12px;color:rgba(40,30,16,.42)">${I[g](88)}</span>`}
      <span class="hero__shade"></span>
      <span class="hero__n">${f.name}</span>
    </div>

    <div class="fields">
      <div class="field">
        <label for="qty">Quantity</label>
        <div class="sel">
          <select id="qty" data-role="qty">
            ${u.opts.map(o => `<option value="${o}" ${o === d.qty ? 'selected' : ''}>${one(o)}</option>`).join('')}
          </select>${I.chevD(18)}
        </div>
      </div>
      <div class="field">
        <label for="unit">Measure</label>
        <div class="sel">
          <select id="unit" data-role="unit">
            ${f.units.map(x => `<option value="${x.id}" ${x.id === d.unit ? 'selected' : ''}>${x.label}</option>`).join('')}
          </select>${I.chevD(18)}
        </div>
      </div>
    </div>

    <div class="card ria">
      <div class="ria__top">
        ${I.spark(19)}<b>Food Insight by Ria</b>
        <span class="chip chip--ai">AI</span>
      </div>
      ${ins ? `
        <h4>A quick look beyond calories</h4>
        <p>${riaBlurb(e.food)}</p>
        <button class="btn btn--block press" style="margin-top:14px" data-act="open-insight">
          View Food Insight ${I.chevR(17)}
        </button>`
      : `
        <h4>Nothing to flag here</h4>
        <p>${f.short || f.name} is a whole food &mdash; mostly water and fibre, no added salt, sugar or oil.
        Ria only steps in when there is something worth knowing.</p>`}
    </div>

    <div class="sechead"><h3>Macronutrients Breakdown</h3></div>
    <div class="card list">
      ${macroRow('Proteins', m.p, 'bar')}
      <div class="hr"></div>
      ${macroRow('Fats', m.f, 'drop')}
      <div class="hr"></div>
      ${macroRow('Carbs', m.c, 'layers')}
    </div>

    <div style="margin-top:8px;font-size:12.5px;color:var(--muted);text-align:center">
      ${fmt(m.cal)} Cal at this portion
    </div>

    <button class="btn btn--block press ${changed ? 'btn--primary' : 'btn--dead'}"
      style="margin-top:14px" data-act="save-food" ${changed ? '' : 'disabled'}>
      Save Changes
    </button>
  </div>`;
}

function macroRow(label, value, ico) {
  return `<div class="macro">${I[ico](18)}<span>${label}</span><span>${one(value)} g</span></div>`;
}

function riaBlurb(food) {
  return food === 'chips'
    ? 'This is a packaged snack. It can be high in sodium and saturated fat, and is easy to overeat.'
    : 'This is a frozen dessert. Most of what is in it is added sugar and dairy fat, and it is eaten in a minute.';
}

/* ---------------------------- 03 food insight ----------------------------- */
function viewInsight() {
  const e = entryById(st.focus);
  const f = FOODS[e.food];
  const ins = INSIGHT[e.food];
  const m = macros(e);

  return `
  ${nav({ title: 'Food Insight' })}
  <div class="body" style="padding-bottom:16px">
    <div class="card fbar">
      ${tile(f.tone, 44, '', f.img)}
      <span>
        <span class="fbar__n">${f.name}</span>
        <span class="fbar__s">${f.kind} &bull; ${fmt(m.cal)} Cal (${compactSub(e)})</span>
      </span>
    </div>

    <div class="card know" style="margin-top:12px">
      <div class="know__top">${I.spark(20)}<b>What you should know</b></div>
      <p class="know__s">A quick, AI-powered look at what this food means for your health.</p>
      ${ins.flags.map(fl => `
        <button class="flag press" data-act="flag" data-id="${fl.id}">
          <span class="flag__i">${I[fl.ico](17)}</span>
          <span class="flag__t">${fl.t}</span>
          <span class="flag__x">${I.info(18)}</span>
        </button>`).join('')}
    </div>

    <div class="card why">
      <div class="why__top">${I.heart(20)}<b>Why it matters</b></div>
      <p>${ins.why}</p>
    </div>

    <div class="sechead"><h3>${I.leaf(19)}Try a better option</h3></div>
    <div class="seg" role="tablist">
      <button role="tab" aria-selected="${st.tab === 'picks'}" data-act="seg" data-id="picks">Healthier picks</button>
      <button role="tab" aria-selected="${st.tab === 'recipes'}" data-act="seg" data-id="recipes">Recipes</button>
    </div>

    <div data-hook="segpanel">${segPanel()}</div>
  </div>
  <div class="askbar">
    <button class="btn btn--block press" data-act="ask-ria">${I.chat(18)}Ask Ria a question</button>
  </div>`;
}

/* The two tabs share everything above them, so switching paints this node
   alone. Re-rendering the screen would throw away the scroll position and
   send the reader back to the top of the insight. */
function segPanel() {
  const e = entryById(st.focus);
  const f = FOODS[e.food];
  const ins = INSIGHT[e.food];

  if (st.tab === 'picks') {
    return `
      <div class="picks">
        ${ins.picks.map(p => pickCard(p, e.id)).join('')}
      </div>
      <p style="font-size:11.5px;line-height:1.5;color:var(--muted-2);margin-top:10px">
        Adding one of these swaps it into ${e.slot.toLowerCase()} in place of ${f.short || f.name}.
      </p>`;
  }
  return `
      <div class="card list" style="margin-top:12px">
        ${ins.recipes.map((r, i) => `
          <button class="rrow press" data-act="recipe" data-id="${r.id}">
            ${tile(r.tone, 46, '', r.img)}
            <span>
              <span class="rrow__n">${r.name}</span>
              <span class="rrow__s">${r.sub}</span>
            </span>
            ${I.chevR(18)}
          </button>
          ${i < ins.recipes.length - 1 ? '<div class="hr"></div>' : ''}`).join('')}
      </div>
      <button class="btn btn--block btn--cream press" style="margin-top:12px" data-act="dead" data-what="The full recipe library">
        View more recipes ${I.ext(16)}
      </button>`;
}

function pickCard(p, entryId) {
  const on = st.swapped[entryId] === p.id;
  return `
  <div class="pick">
    ${tile(p.tone, 94, 'tile--lg', p.img)}
    <span class="pick__n">${p.name}</span>
    <span class="pick__b">
      <span class="pick__m">${p.meta}</span>
      <button class="pick__a press" data-act="pick-add" data-id="${p.id}" ${on ? 'disabled' : ''}
        aria-label="${on ? 'Already swapped in' : 'Swap in ' + esc(p.name.replace(/&amp;/g, '&'))}">
        ${on ? I.check(13) : I.plus(14)}
      </button>
    </span>
  </div>`;
}

/* -------------------------------- 06 chat --------------------------------- */
function viewChat() {
  const e = entryById(st.focus);
  const f = FOODS[e.food];

  return `
  ${nav({ title: 'Ria' })}
  <div class="card ctx">
    ${tile(f.tone, 42, '', f.img)}
    <span>
      <span class="ctx__n">${f.name}, ${compactSub(e)}</span>
      <span class="ctx__s">Food Insight</span>
    </span>
  </div>
  <div class="thread">
    ${st.messages.map(renderMsg).join('')}
    ${st.typing ? '<div class="typing"><i></i><i></i><i></i></div>' : ''}
  </div>
  <div class="composer">
    <div class="talk">
      <input data-role="talk" placeholder="Talk to Ria" value="${esc(st.composer)}" aria-label="Talk to Ria">
      <button class="press" data-act="dead" data-what="Attachments" aria-label="More">${I.dotsH(20)}</button>
    </div>
    <button class="mic press" data-act="send-or-voice" aria-label="Send">
      ${st.composer.trim() ? I.chevR(22) : I.mic(22)}
    </button>
  </div>`;
}

function renderMsg(m) {
  const seen = m.seen ? ' msg--seen' : '';
  if (m.role === 'user') {
    return `<div class="me msg${seen}"><div class="me__bubble">${esc(m.text)}</div></div>`;
  }
  const body = `<div class="ria-say msg${seen}">${I.spark(20)}<p>${m.text}</p></div>`;
  if (m.kind === 'starters') return body + renderStarters();
  if (m.kind === 'picks') return body + renderInChatPicks();
  if (m.kind === 'recipes') return body + renderInChatRecipes();
  return body;
}

function STARTERS() {
  const e = entryById(st.focus);
  const word = e.food === 'chips' ? 'snack' : 'dessert';
  return [
    { t: 'Is it ok to eat this regularly?', ico: 'utensils' },
    { t: `What are my better ${word} options?`, s: 'A few ideas to choose from', ico: 'chart' },
  ];
}
function renderStarters() {
  return `
  <div class="starters">
    ${STARTERS().map((s, i) => `
      <button class="starter press" data-act="starter" data-id="${i}">
        ${I[s.ico](18)}
        <span>
          <span class="starter__t">${s.t}</span>
          ${s.s ? `<span class="starter__s">${s.s}</span>` : ''}
        </span>
      </button>`).join('')}
  </div>
  <p class="hint">Or just tell me what you need.</p>`;
}
function renderInChatPicks() {
  const e = entryById(st.focus);
  return `<div class="inchat">${INSIGHT[e.food].picks.map(p => pickCard(p, e.id)).join('')}</div>`;
}
function renderInChatRecipes() {
  const e = entryById(st.focus);
  return `
  <div class="card list" style="margin:10px 0 0 32px;padding:0 12px">
    ${INSIGHT[e.food].recipes.map((r, i) => `
      <button class="rrow press" data-act="recipe" data-id="${r.id}">
        ${tile(r.tone, 40, '', r.img)}
        <span><span class="rrow__n">${r.name}</span><span class="rrow__s">${r.sub}</span></span>
        ${I.chevR(18)}
      </button>
      ${i < 2 ? '<div class="hr"></div>' : ''}`).join('')}
  </div>`;
}

/* -------------------------------- sheets ---------------------------------- */
function viewFlagSheet() {
  const e = entryById(st.focus);
  const fl = INSIGHT[e.food].flags.find(x => x.id === st.sheet.id);
  return `
  <button class="scrim" data-act="sheet-close" aria-label="Close"></button>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(fl.t)}" style="max-height:72%">
    <div class="grabber"></div>
    <div class="sheet__head">
      <span class="sheet__i sheet__i--flag">${I[fl.ico](18)}</span>
      <b>${fl.t}</b>
      <button class="sheet__x press" data-act="sheet-close" aria-label="Close">${I.close(20)}</button>
    </div>
    <div class="sheet__body">
      <p>${fl.p}</p>
      <div class="pinkcard">
        <b>Why it matters</b>
        <p>${fl.why}</p>
      </div>
      <div class="dolabel">What you can do</div>
      ${fl.do.map(d => `<div class="do">${I.check(16)}<span>${d}</span></div>`).join('')}
      <button class="btn btn--block press" style="margin-top:8px" data-act="sheet-to-options">
        ${I.leaf(17)}See better options
      </button>
    </div>
  </div>`;
}

function viewRecipeSheet() {
  const e = entryById(st.focus);
  const r = INSIGHT[e.food].recipes.find(x => x.id === st.sheet.id);
  return `
  <button class="scrim" data-act="sheet-close" aria-label="Close"></button>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(r.name)}" style="max-height:78%">
    <div class="grabber"></div>
    <div class="sheet__head">
      ${r.img ? tile(r.tone, 34, '', r.img) : `<span class="sheet__i sheet__i--rec">${I.bowl(18)}</span>`}
      <b>${r.name}</b>
      <button class="sheet__x press" data-act="sheet-close" aria-label="Close">${I.close(20)}</button>
    </div>
    <div class="sheet__body">
      <p>${r.why}</p>
      <div class="meta"><span><b>${r.time}</b></span><span><b>${r.cal}</b></span></div>
      <ol class="steps">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      <button class="btn btn--block btn--cream press" style="margin-top:6px" data-act="dead" data-what="The full recipe library">
        View more recipes ${I.ext(16)}
      </button>
    </div>
  </div>`;
}

function viewMenuSheet() {
  const e = entryById(st.sheet.id);
  const has = !!flagsFor(e);
  return `
  <button class="scrim" data-act="sheet-close" aria-label="Close"></button>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(entryName(e))}" style="max-height:52%">
    <div class="grabber"></div>
    <div class="sheet__head">
      ${tile(entryTone(e), 34, '', e.pick ? null : FOODS[e.food].img)}
      <b>${entryName(e)}</b>
      <button class="sheet__x press" data-act="sheet-close" aria-label="Close">${I.close(20)}</button>
    </div>
    <div class="sheet__body menu">
      ${has ? `<button data-act="menu-insight" data-id="${e.id}">${I.spark(19)}View Food Insight</button>` : ''}
      <button data-act="menu-edit" data-id="${e.id}">${I.pencil(19)}Edit quantity</button>
      <button class="danger" data-act="menu-remove" data-id="${e.id}">${I.trash(19)}Remove from log</button>
    </div>
  </div>`;
}

/* -------------------------------- engine ---------------------------------- */
function goto(screen, opts = {}) {
  st.screen = screen;
  st.back = !!opts.back;
  render();
  if (opts.focus) setTimeout(() => {
    const el = document.querySelector('[data-role="talk"]');
    el && el.focus();
  }, 140);
}

function closeSheet(then) {
  const sheet = document.querySelector('.overlay .sheet');
  const scrim = document.querySelector('.overlay .scrim');
  if (!sheet) { st.sheet = null; then && then(); return; }
  sheet.classList.add('sheet--out');
  scrim && scrim.classList.add('scrim--out');
  setTimeout(() => {
    st.sheet = null;
    ov().innerHTML = '';
    then ? then() : render({ animate: false });
  }, 250);
}

function toast(text, ms = 2600, action) {
  const host = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${text}</span>${action ? `<button data-act="${action.act}">${action.label}</button>` : ''}`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('toast--out'); setTimeout(() => el.remove(), 280); }, ms);
}
function clearToasts() { document.getElementById('toasts').innerHTML = ''; }

function nextId() { return 'm' + (++st.msgSeq); }
function msg(o) { const m = { id: nextId(), seen: false, ...o }; st.messages.push(m); return m; }
function riaText(text, kind) { return msg({ role: 'ria', kind: kind || 'text', text }); }

function ensureIntro() {
  if (st.messages.length) return;
  const e = entryById(st.focus);
  const f = FOODS[e.food];
  riaText(`Hi, I&rsquo;m Ria. Ask me anything about <b>${f.short || f.name}</b> &mdash; what is in it,
    how it fits today, or what to have instead.`, 'starters');
}

function think(fn, delay = 760) {
  st.typing = true;
  render({ animate: false });
  setTimeout(() => { st.typing = false; fn(); render({ animate: false }); }, delay);
}

/* ------------------------- the log, actually changing --------------------- */
function applyPick(entryId, pick) {
  const e = entryById(entryId);
  st.undo = { id: entryId, snap: JSON.parse(JSON.stringify(e)), swapped: st.swapped[entryId] };
  e.pick = pick;
  e.qty = 1;
  st.swapped[entryId] = pick.id;
}
function undoPick() {
  if (!st.undo) return;
  const e = entryById(st.undo.id);
  Object.keys(e).forEach(k => delete e[k]);
  Object.assign(e, st.undo.snap);
  if (st.undo.swapped) st.swapped[e.id] = st.undo.swapped; else delete st.swapped[e.id];
  st.undo = null;
  clearToasts();
  render({ animate: false });
  toast('Swap undone.');
}

/* -------------------------------- actions --------------------------------- */
const ACTIONS = {
  back: () => {
    if (st.screen === 'chat') return goto('insight', { back: true });
    if (st.screen === 'insight') return goto('food', { back: true });
    if (st.screen === 'food') return goto('log', { back: true });
    toast('This is where the prototype starts.');
  },

  'open-food': (el) => {
    const e = entryById(el.dataset.id);
    st.focus = e.id;
    st.draft = { id: e.id, qty: e.qty, unit: e.unit };
    if (e.pick) { toast('Already swapped — Ria has nothing left to flag here.'); return; }
    goto('food');
  },

  'row-menu': (el) => { st.sheet = { kind: 'menu', id: el.dataset.id }; renderOverlay(); },
  'sheet-close': () => closeSheet(),

  'menu-insight': (el) => {
    const id = el.dataset.id;
    closeSheet(() => { st.focus = id; st.tab = 'picks'; goto('insight'); });
  },
  'menu-edit': (el) => {
    const e = entryById(el.dataset.id);
    closeSheet(() => { st.focus = e.id; st.draft = { id: e.id, qty: e.qty, unit: e.unit }; goto('food'); });
  },
  'menu-remove': (el) => {
    const id = el.dataset.id;
    const snap = JSON.parse(JSON.stringify(entryById(id)));
    const idx = st.entries.findIndex(e => e.id === id);
    closeSheet(() => {
      st.entries.splice(idx, 1);
      if (st.screen !== 'log') { st.screen = 'log'; }
      render({ animate: false });
      st.undo = { restore: () => st.entries.splice(idx, 0, snap) };
      toast(`${snap.pick ? snap.pick.name : FOODS[snap.food].name} removed.`, 4200, { act: 'undo-remove', label: 'Undo' });
    });
  },
  'undo-remove': () => {
    if (st.undo && st.undo.restore) { st.undo.restore(); st.undo = null; }
    clearToasts();
    render({ animate: false });
  },

  'save-food': () => {
    const e = entryById(st.draft.id);
    e.qty = st.draft.qty;
    e.unit = st.draft.unit;
    goto('log', { back: true });
    toast(`${FOODS[e.food].short || FOODS[e.food].name} updated to ${entrySub(e)}.`);
  },

  'open-insight': () => { st.focus = st.draft.id; st.tab = 'picks'; goto('insight'); },

  seg: (el) => {
    st.tab = el.dataset.id;
    const host = document.querySelector('[data-hook="segpanel"]');
    if (!host) return render({ animate: false });
    host.innerHTML = segPanel();
    document.querySelectorAll('.seg button[data-act="seg"]').forEach(b => {
      b.setAttribute('aria-selected', String(b.dataset.id === st.tab));
    });
  },

  flag: (el) => { st.sheet = { kind: 'flag', id: el.dataset.id }; renderOverlay(); },
  'sheet-to-options': () => closeSheet(() => {
    st.tab = 'picks';
    render({ animate: false });
    const seg = document.querySelector('.seg');
    seg && seg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }),

  recipe: (el) => { st.sheet = { kind: 'recipe', id: el.dataset.id }; renderOverlay(); },

  'pick-add': (el) => {
    const e = entryById(st.focus);
    const pick = INSIGHT[e.food].picks.find(p => p.id === el.dataset.id);
    applyPick(e.id, pick);
    const done = () => {
      st.screen = 'log';
      render();
      clearToasts();
      toast(`${pick.name.replace(/&amp;/g, '&')} swapped into ${e.slot.toLowerCase()}.`, 4600,
        { act: 'undo-pick', label: 'Undo' });
    };
    st.sheet ? closeSheet(done) : done();
  },
  'undo-pick': () => undoPick(),

  'ask-ria': () => { ensureIntro(); goto('chat'); },

  starter: (el) => {
    const s = STARTERS()[Number(el.dataset.id)];
    send(s.t);
  },

  'send-or-voice': () => {
    if (st.composer.trim()) return send(st.composer.trim());
    toast('Voice is out of scope for this prototype.');
  },

  'guide-toggle': () => { guideOpen = !guideOpen; saveGuide(); renderGuide(); },
  'note-open': () => setNote(true),
  'note-close': () => setNote(false),

  dead: (el) => toast(`${el.dataset.what || 'That'} is outside this prototype.`),
};

/* ------------------------------ chat responder ---------------------------- */
function send(text) {
  msg({ role: 'user', text });
  st.composer = '';
  const input = document.querySelector('[data-role="talk"]');
  if (input) input.value = '';
  render({ animate: false });
  think(() => respond(text));
}

function respond(raw) {
  const t = raw.toLowerCase();
  const e = entryById(st.focus);
  const f = FOODS[e.food];
  const ins = INSIGHT[e.food];
  const cal = r0(macros(e).cal);
  const slot = e.slot.toLowerCase();

  if (/\b(option|alternative|instead|better|swap|idea|what else)s?\b/.test(t)) {
    return riaText(`Three that do the same job for fewer calories. Adding one swaps it into
      ${slot} in place of ${f.short || f.name}.`, 'picks');
  }
  if (/\b(recipe|cook|make|homemade|home)s?\b/.test(t)) {
    return riaText('If you would rather make something, these three are closest in spirit.', 'recipes');
  }
  if (/\b(regular(ly)?|often|daily|every ?day|ok to eat|okay to eat|how often)\b/.test(t)) {
    return riaText(`At this portion it is about ${cal} Cal &mdash; ${Math.round(cal / DAY_TARGET * 100)}%
      of your day. Once or twice a week is not the problem. Daily is, because the
      ${e.food === 'chips' ? 'sodium' : 'added sugar'} adds up long before the calories do.`);
  }
  if (/\b(sodium|salt|salty)\b/.test(t)) {
    const fl = ins.flags.find(x => x.id === 'sodium');
    return riaText(fl ? `${fl.p} ${fl.why}` : 'Sodium is not the issue with this one &mdash; sugar is.');
  }
  if (/\b(sugar|sweet)s?\b/.test(t)) {
    const fl = ins.flags.find(x => x.id === 'sugar');
    return riaText(fl ? `${fl.p} ${fl.why}`
      : 'There is very little added sugar here. The sodium and the fat are what to watch.');
  }
  if (/\b(fat|cholesterol|oil|fried)s?\b/.test(t)) {
    const fl = ins.flags.find(x => x.id === 'satfat' || x.id === 'satfat2');
    return riaText(`${fl.p} ${fl.why}`);
  }
  if (/\b(portion|how much|how many|quantity|serving)s?\b/.test(t)) {
    return riaText(`You logged ${entrySub(e)}. Tip it into a bowl rather than eating from the
      ${e.food === 'chips' ? 'packet' : 'wrapper'} &mdash; the portion stops deciding itself.`);
  }
  if (/\b(calorie|cal|budget|fit|day|today|breakfast|left)s?\b/.test(t)) {
    const slotCal = r0(slotEaten(e.slot));
    const target = SLOTS.find(s => s.name === e.slot).target;
    return riaText(`${cal} Cal at this portion. ${e.slot} is at ${fmt(slotCal)} against a
      ${fmt(target)} target${slotCal > target ? ', so it is already over' : ''}, and the day is at
      ${fmt(dayEaten())} of ${fmt(DAY_TARGET)}.`);
  }
  if (/\b(protein|macro|carb|fibre|fiber)s?\b/.test(t)) {
    const m = macros(e);
    return riaText(`At this portion: <b>${one(m.p)} g protein</b>, ${one(m.f)} g fat,
      ${one(m.c)} g carbs. Not much of it is protein, which is why it does not keep you full.`);
  }
  if (/\b(why|matter|bad|unhealthy|harm)s?\b/.test(t)) {
    return riaText(ins.why);
  }
  return riaText(`I can tell you what is in ${f.short || f.name}, how it fits today,
    whether it is fine to eat often, or what to have instead.`, 'starters');
}

/* --------------------------------- guide ---------------------------------- */
const GUIDE = [
  { k: 'notice', ico: 'spark', t: 'Notice it while logging',
    s: 'The log flags the entries worth a second look, right underneath them. Nothing to ask for &mdash; it is already sitting there.',
    tap: 'Tap <b>Calories aren&rsquo;t the full picture</b> under Lays Chilli Chips',
    asks: [] },
  { k: 'understand', ico: 'chart', t: 'Understand the food',
    s: 'Food Insight: what this food actually is, the two or three things worth knowing, and why each one matters. Tap a flag for the full explanation.',
    tap: 'Food detail &rarr; <b>View Food Insight</b>, then any &#9432;',
    asks: [] },
  { k: 'act', ico: 'leaf', t: 'Do something about it',
    s: 'Healthier picks that swap into the log in one tap, recipes to cook instead, or ask Ria in your own words.',
    tap: 'Insight &rarr; <b>Healthier picks</b> / <b>Recipes</b>, or <b>Ask Ria a question</b>',
    asksLead: 'Things you can type in the chat:',
    asks: ['is it ok to eat this regularly?', 'what are my better snack options?',
           'how much sodium is in this?', 'how does it fit my day?'] },
];

let guideOpen = true;
try { guideOpen = localStorage.getItem('hbc.guide') !== 'off'; } catch (e) { /* private mode */ }
function saveGuide() { try { localStorage.setItem('hbc.guide', guideOpen ? 'on' : 'off'); } catch (e) {} }

let noteOpen = false;
function setNote(open) {
  noteOpen = open;
  const pane = document.getElementById('note');
  const scrim = document.querySelector('.note-scrim');
  if (!pane) return;
  pane.classList.toggle('note--open', open);
  pane.setAttribute('aria-hidden', String(!open));
  if (scrim) scrim.classList.toggle('note-scrim--on', open);
  if (open) pane.scrollTop = 0;
}

function renderGuide() {
  const host = document.getElementById('guide');
  if (!host) return;
  host.classList.toggle('guide--off', !guideOpen);
  document.body.classList.toggle('guide-off', !guideOpen);

  fitDevice();

  if (!guideOpen) {
    host.innerHTML = `<button class="guide__pill" data-act="guide-toggle">${I.info(15)}Three core flows</button>`;
    return;
  }

  host.innerHTML = `
  <div class="guide__card">
    <div class="guide__top">
      <div>
        <div class="guide__eyebrow">Healthify &middot; prototype</div>
        <h1 class="guide__title">Beyond calories</h1>
      </div>
      <button class="guide__hide" data-act="guide-toggle">Hide</button>
    </div>
    <p class="guide__sub">Give context beyond the calorie, explain what it means, and help people take a
    better next step &mdash; with AI, without making chat a mandatory step. It all starts on the food log.</p>

    <div class="guide__flows">
      ${GUIDE.map((f, i) => `
        <div class="flow">
          <div class="flow__head">
            <span class="flow__ico">${I[f.ico](15)}</span>
            <span class="flow__t">${f.t}</span>
            <span class="flow__n">0${i + 1}</span>
          </div>
          <p class="flow__s">${f.s}</p>
          <p class="flow__how">${f.tap}</p>
          ${f.asksLead ? `<p class="flow__lead">${f.asksLead}</p>` : ''}
          ${f.asks.length ? `<div class="flow__asks">${f.asks.map(a => `<span class="ask">&ldquo;${a}&rdquo;</span>`).join('')}</div>` : ''}
        </div>`).join('')}
    </div>

    <p class="guide__foot">
      ${I.info(14)}
      <span>Ria stays quiet on whole foods. Open the <b>melon</b> under Morning Snack and there is
      nothing to flag &mdash; the nudge only appears where it has something to say.</span>
    </p>
  </div>`;
}

/* ------------------------------ fit to window ----------------------------- */
/* The phone is a fixed 414x868. Scale it to whatever room the stage actually
   has, so the whole device is always on screen and the scrolling happens
   inside it rather than in the page. */
function fitDevice() {
  const el = document.querySelector('.device');
  if (!el) return;
  const CHROME = 82;                       // stage padding + gap + footer row
  const side = (window.innerWidth > 980 && !document.body.classList.contains('guide-off')) ? 320 : 0;
  const byHeight = (window.innerHeight - CHROME) / 868;
  const byWidth = (window.innerWidth - side - 32) / 414;
  el.style.setProperty('--s', Math.max(0.5, Math.min(1, byHeight, byWidth)).toFixed(3));
}
window.addEventListener('resize', fitDevice);

/* ------------------------------- bootstrap -------------------------------- */
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) { ev.preventDefault(); fn(el); }
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (!st.draft) return;
  if (el.dataset.role === 'qty') { st.draft.qty = Number(el.value); render({ animate: false }); }
  if (el.dataset.role === 'unit') {
    const f = FOODS[entryById(st.draft.id).food];
    const u = f.units.find(x => x.id === el.value);
    st.draft.unit = u.id;
    // keep the portion roughly where it was rather than snapping to the first option
    if (!u.opts.includes(st.draft.qty)) st.draft.qty = u.opts[Math.min(2, u.opts.length - 1)];
    render({ animate: false });
  }
});

document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (el.dataset.role !== 'talk') return;
  const had = !!st.composer.trim();
  st.composer = el.value;
  if (had !== !!el.value.trim()) {
    const btn = document.querySelector('.composer .mic');
    if (btn) btn.innerHTML = el.value.trim() ? I.chevR(22) : I.mic(22);
  }
});

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && ev.target.dataset.role === 'talk') {
    ev.preventDefault();
    if (st.composer.trim()) send(st.composer.trim());
    return;
  }
  if (ev.key !== 'Escape') return;
  if (noteOpen) setNote(false);
  else if (st.sheet) closeSheet();
});

document.getElementById('restart').addEventListener('click', () => {
  st = freshState();
  entrySeq = 3;
  ov().innerHTML = '';
  clearToasts();
  render();
});

st.focus = 'e2';
render({ animate: false });
fitDevice();
