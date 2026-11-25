/* ==========================================================
   LOGO WALL + MARQUEE
   Data lives in logos-data.js (LOGOS + LOGO_SECTORS).
   Each entry: n = name, s = sector, t = optional note,
               f = image file, b = tile background, m = "c" (contain) | "p" (photo/cover)
   ========================================================== */
const esc = s => String(s).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;");
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
          s.style.animationDelay = (n++ * 70 + 750) + "ms";
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

/* ==========================================================
   v3 UX + motion layer
   ========================================================== */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* extra reveal targets */
document.querySelectorAll(".kicker,.two-col,.chips,.case,.step,.job").forEach(el => { el.classList.add("reveal"); io.observe(el); });
document.querySelectorAll(".chips span,.case-metrics li").forEach((el, i) => el.style.setProperty("--i", i % 12));
document.querySelectorAll(".svc,.card,.stat,.case").forEach(el => el.classList.add("spot"));

/* theme toggle */
(function () {
  const b = document.getElementById("theme");
  const root = document.documentElement;
  if (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
  b.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    document.querySelector('meta[name="theme-color"]').content = next === "dark" ? "#0a0c1b" : "#4338CA";
  });
})();

/* cursor glow + spotlight + magnetic buttons */
if (fine && !reduce) {
  const glow = document.getElementById("glow");
  let gx = 0, gy = 0, tx = 0, ty = 0;
  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; });
  (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();

  document.addEventListener("mousemove", e => {
    const t = e.target.closest && e.target.closest(".spot");
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", (e.clientX - r.left) + "px");
    t.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3 - 2}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });

  /* 3D tilt on service + project cards */
  document.querySelectorAll(".svc,.card").forEach(c => {
    c.addEventListener("mousemove", e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transition = "transform .08s";
      c.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    c.addEventListener("mouseleave", () => { c.style.transition = ""; c.style.transform = ""; });
  });
}

/* scrollspy */
(function () {
  const links = [...document.querySelectorAll("#menu a[href^='#']")].filter(a => !a.classList.contains("btn"));
  const secs = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => spy.observe(s));
})();

/* scroll-linked effects: parallax, drawn lines, back-to-top */
(function () {
  const up = document.getElementById("up");
  const tl = document.querySelector(".timeline");
  const steps = document.querySelector(".steps");
  const hero = document.querySelector(".hero");
  const prog = (el, k = .75) => {
    const r = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (innerHeight * k - r.top) / r.height));
  };
  let tick = false;
  function update() {
    tick = false;
    up.classList.toggle("show", scrollY > 700);
    if (tl) tl.style.setProperty("--p", (prog(tl) * 100) + "%");
    if (steps) steps.style.setProperty("--p", prog(steps, .85));
    if (!reduce && scrollY < 1200) {
      hero.style.setProperty("--p3", (scrollY * .15) + "px");
    }
  }
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  up.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
})();
