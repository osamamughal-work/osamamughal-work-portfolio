/* ==========================================================
   LOGO WALL
   Data lives in logos-data.js (LOGOS + LOGO_SECTORS).
   Each entry: n = name, s = sector, t = optional note,
               f = image file, b = tile background, m = "c" (contain) | "p" (photo/cover)
   To add a brand: drop the image in assets/logos/ and add an entry to logos-data.js.
   ========================================================== */
const grid = document.getElementById("brandGrid");
const filters = document.getElementById("filters");
const search = document.getElementById("brandSearch");
const countEl = document.getElementById("wallCount");
let activeSector = "All";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function tile(l) {
  return `<figure class="logo-tile">
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

/* Logo marquee: two rows moving in opposite directions */
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

/* Count-up stats */
function countUp(el) {
  const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
  const t0 = performance.now(), dur = 1400;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    if (en.target.dataset.count) countUp(en.target);
    en.target.classList.add("in");
    io.unobserve(en.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll("[data-count]").forEach(el => io.observe(el));
document.querySelectorAll(".section h2, .card, .scale-card, .case, .job").forEach(el => {
  el.classList.add("reveal"); io.observe(el);
});

document.getElementById("yr").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.getElementById("primary-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  primaryNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
