/* ==========================================================
   LOGO WALL + MARQUEE
   Data lives in logos-data.js (LOGOS + LOGO_SECTORS).
   Each entry: n = name, s = sector, t = optional note,
               f = image file, b = tile background, m = "c" (contain) | "p" (photo/cover)
   ========================================================== */
const grid = document.getElementById("brandGrid");
const filters = document.getElementById("filters");
const search = document.getElementById("brandSearch");
const countEl = document.getElementById("wallCount");
let activeSector = "All";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function tile(l, i) {
  return `<figure class="logo-tile" style="animation-delay:${Math.min(i, 20) * 25}ms">
    <div class="logo-box${l.m === "p" ? " photo" : ""}" style="background:${l.b}">
      <div class="fit"><img src="${l.f}" alt="${esc(l.n)} logo" loading="lazy" width="${l.w}" height="${l.h}"></div>
    </div>
    <figcaption><b>${esc(l.n)}</b>${l.t ? `<span>${esc(l.t)}</span>` : ""}</figcaption>
  </figure>`;
}

function renderWall() {
  const q = search.value.trim().toLowerCase();
  const list = LOGOS.filter(l =>
    (activeSector === "All" || l.s === activeSector) &&
    (!q || l.n.toLowerCase().includes(q) || l.s.toLowerCase().includes(q) || (l.t || "").toLowerCase().includes(q)));
  grid.innerHTML = list.length ? list.map(tile).join("") : `<p class="empty">No brands match that search.</p>`;
  countEl.textContent = (activeSector === "All" && !q)
    ? `${LOGOS.length} brands across ${LOGO_SECTORS.length} sectors`
    : `Showing ${list.length} of ${LOGOS.length} brands`;
}

function renderFilters() {
  const count = s => s === "All" ? LOGOS.length : LOGOS.filter(l => l.s === s).length;
  filters.innerHTML = ["All", ...LOGO_SECTORS]
    .map(s => `<button class="${s === activeSector ? "on" : ""}" data-s="${esc(s)}">${esc(s)}<span>${count(s)}</span></button>`).join("");
}

filters.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  activeSector = b.dataset.s;
  renderFilters();
  renderWall();
});
search.addEventListener("input", renderWall);
renderFilters();
renderWall();

/* Two auto-moving logo rows, opposite directions */
(function () {
  const box = document.getElementById("marquee");
  if (!box) return;
  const pool = LOGOS.filter(l => l.m === "c");
  const rows = [pool.filter((_, i) => i % 2 === 0), pool.filter((_, i) => i % 2 === 1)];
  const group = list => `<div class="logo-group">${list.map(l =>
    `<div class="chip" style="background:${l.b}"><img src="${l.f}" alt="${esc(l.n)}" loading="lazy" width="${l.w}" height="${l.h}"></div>`).join("")}</div>`;
  box.innerHTML = rows.map((r, i) =>
    `<div class="marquee-track ${i ? "move-right" : "move-left"}">${group(r)}${group(r).replace('<div class="logo-group">', '<div class="logo-group" aria-hidden="true">')}</div>`).join("");
})();

/* ==========================================================
   HERO: headline word-by-word reveal + rotating phrase
   ========================================================== */
(function () {
  const h1 = document.querySelector("h1.split");
  if (!h1) return;
  let n = 0;
  const wrap = node => {
    node.childNodes.forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(" "); return; }
          const w = document.createElement("span");
          w.className = "w";
          const s = document.createElement("span");
          s.textContent = t;
          s.style.animationDelay = (n++ * 70 + 150) + "ms";
          w.append(s);
          frag.append(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains("w")) wrap(c);
    });
  };
  wrap(h1);

  const swap = document.getElementById("swap");
  if (!swap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const phrases = ["not just clicks.", "not just likes.", "not just reach.", "not just leads."];
  let i = 0;
  const target = swap.querySelector(".w>span") ? null : swap;
  setInterval(() => {
    i = (i + 1) % phrases.length;
    swap.style.transition = "opacity .3s, transform .3s";
    swap.style.opacity = 0; swap.style.transform = "translateY(8px)";
    setTimeout(() => {
      swap.textContent = phrases[i];
      swap.style.opacity = 1; swap.style.transform = "none";
    }, 300);
  }, 3200);
})();

/* ==========================================================
   COUNTERS + SCROLL REVEAL
   ========================================================== */
function countUp(el) {
  const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
  const t0 = performance.now(), dur = 1600;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

// stagger siblings
document.querySelectorAll(".grid3,.steps,.cards,.stats,.case-metrics,.badges").forEach(p =>
  [...p.children].forEach((c, i) => c.style.setProperty("--d", (i * 0.08) + "s")));

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    if (en.target.dataset.count) countUp(en.target);
    en.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
document.querySelectorAll(".fc-1 [data-count]").forEach(el => io.observe(el));

/* ==========================================================
   NAV: scroll shadow, progress bar, mobile menu
   ========================================================== */
const nav = document.getElementById("nav");
const bar = document.getElementById("progress");
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 8);
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + "%";
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.closest("a")) { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

/* Subtle tilt on the hero photo */
(function () {
  const v = document.querySelector(".hero-visual");
  if (!v || matchMedia("(hover: none)").matches) return;
  const f = v.querySelector(".photo-frame");
  v.addEventListener("mousemove", e => {
    const r = v.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    f.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  v.addEventListener("mouseleave", () => { f.style.transform = ""; });
})();

document.getElementById("yr").textContent = new Date().getFullYear();
