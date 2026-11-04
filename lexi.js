/* =====================================================
   LEXI — maskot Vocab Lab + pengaturan tema
   ===================================================== */
(function () {
  "use strict";

  // ---------------- tema: otomatis / terang / gelap ----------------
  const THEME_KEY = "vocabLab.theme";
  const root = document.documentElement;
  const hostTheme = root.getAttribute("data-theme");
  let theme = "auto";
  try { theme = localStorage.getItem(THEME_KEY) || "auto"; } catch (e) {}
  function applyTheme() {
    if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
    else if (hostTheme) root.setAttribute("data-theme", hostTheme);
    else root.removeAttribute("data-theme");
  }
  applyTheme();
  const THEME_ICON = {
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z"/></svg>'
  };
  const THEME_LABEL = {
    auto: ["Tema: otomatis", "Theme: automatic"],
    light: ["Tema: terang", "Theme: light"],
    dark: ["Tema: gelap", "Theme: dark"]
  };
  function bindThemeButton() {
    const b = document.getElementById("themeBtn");
    if (!b) return;
    const paint = () => {
      b.innerHTML = THEME_ICON[theme];
      const lbl = THEME_LABEL[theme][window.VL_LANG === "en" ? 1 : 0];
      b.setAttribute("aria-label", lbl);
      b.title = lbl;
    };
    paint();
    b.onclick = () => {
      theme = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
      applyTheme();
      paint();
    };
  }

  // ---------------- gambar Lexi ----------------
  let uid = 0;
  const EYES = {
    happy: ["open", "open"], excited: ["open", "open"], joy: ["joy", "joy"], wink: ["open", "joy"],
    sleepy: ["sleep", "sleep"], sad: ["open", "open"], surprised: ["open", "open"],
    thinking: ["open", "open"], proud: ["joy", "joy"]
  };
  const MOUTH = {
    smile: '<path d="M53 76 Q60 82 67 76" fill="none" stroke="#2a2150" stroke-width="2.6" stroke-linecap="round"/>',
    open: '<path d="M52.5 75 Q60 76.5 67.5 75 Q66.5 85 60 85 Q53.5 85 52.5 75z" fill="#2a2150"/><path d="M55.5 81.5 Q60 79.5 64.5 81.5 Q62.5 84.6 60 84.6 Q57.5 84.6 55.5 81.5z" fill="#ff7a9c"/>',
    flat: '<path d="M54.5 78.5 Q60 77.5 66 76.5" fill="none" stroke="#2a2150" stroke-width="2.6" stroke-linecap="round"/>',
    frown: '<path d="M53.5 81 Q60 75 66.5 81" fill="none" stroke="#2a2150" stroke-width="2.6" stroke-linecap="round"/>',
    o: '<ellipse cx="60" cy="79" rx="4" ry="4.8" fill="#2a2150"/>',
    tiny: '<path d="M56.5 78 Q60 80.5 63.5 78" fill="none" stroke="#2a2150" stroke-width="2.4" stroke-linecap="round"/>'
  };
  const MOUTH_OF = { happy: "smile", excited: "open", joy: "open", wink: "smile", sleepy: "tiny", sad: "frown", surprised: "o", thinking: "flat", proud: "smile" };

  function eye(side, kind, mood) {
    const cx = side === "L" ? 45 : 75;
    if (kind === "joy") return `<path d="M${cx - 8} 62 Q${cx} 52 ${cx + 8} 62" fill="none" stroke="#2a2150" stroke-width="3" stroke-linecap="round"/>`;
    if (kind === "sleep") return `<path d="M${cx - 8} 60 Q${cx} 66 ${cx + 8} 60" fill="none" stroke="#2a2150" stroke-width="3" stroke-linecap="round"/>`;
    const r = mood === "surprised" ? 4.2 : 5.6;
    const ry = mood === "surprised" ? 13.5 : 12.5;
    return `<g class="lx-eye" data-cx="${cx}" data-cy="60"><ellipse cx="${cx}" cy="60" rx="11" ry="${ry}" fill="#fff"/>` +
      `<g class="lx-pupil"><circle cx="${cx}" cy="61" r="${r}" fill="#2a2150"/><circle cx="${cx + 2.2}" cy="58.6" r="1.9" fill="#fff"/></g></g>`;
  }
  function brows(mood) {
    const s = 'fill="none" stroke="#2a2150" stroke-width="2.6" stroke-linecap="round"';
    if (mood === "sad") return `<path d="M36 47 L50 43" ${s}/><path d="M84 47 L70 43" ${s}/>`;
    if (mood === "thinking") return `<path d="M37 44 Q45 39 53 43" ${s}/><path d="M68 46 L82 46" ${s}/>`;
    if (mood === "surprised") return `<path d="M37 42 Q45 37 53 42" ${s}/><path d="M67 42 Q75 37 83 42" ${s}/>`;
    return "";
  }
  const sparkle = (x, y, s, c) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}z" fill="${c}"/>`;
  function extras(mood) {
    if (mood === "excited" || mood === "joy" || mood === "proud")
      return `<g class="lx-sparkles">${sparkle(10, 40, 6, "#ffc94d")}${sparkle(110, 50, 5, "#ff8fb3")}${sparkle(104, 26, 3.5, "#7dd3fc")}</g>`;
    if (mood === "sad") return '<path class="lx-tear" d="M33 67 Q30 73 33 76 Q36 73 33 67z" fill="#7dd3fc"/>';
    if (mood === "sleepy") return '<g class="lx-zz" fill="var(--lx-2)" font-family="-apple-system, system-ui, sans-serif" font-weight="800"><text x="96" y="34" font-size="13">z</text><text x="106" y="20" font-size="10">z</text></g>';
    if (mood === "thinking") return '<g class="lx-think" fill="var(--lx-belly)" stroke="var(--lx-2)" stroke-width="1.2"><circle cx="100" cy="38" r="3"/><circle cx="106" cy="27" r="4.4"/><circle cx="111" cy="13" r="7"/></g>';
    if (mood === "surprised") return '<g fill="var(--lx-2)"><rect x="104" y="20" width="4" height="13" rx="2"/><circle cx="106" cy="38" r="2.4"/></g>';
    return "";
  }
  function prop(kind) {
    const arms = (y) => `<ellipse cx="20" cy="${y}" rx="6.5" ry="8" fill="var(--lx-2)"/><ellipse cx="100" cy="${y}" rx="6.5" ry="8" fill="var(--lx-2)"/>`;
    if (kind === "book") return `
      <ellipse cx="27" cy="94" rx="7" ry="6" fill="var(--lx-2)"/><ellipse cx="93" cy="94" rx="7" ry="6" fill="var(--lx-2)"/>
      <path d="M60 96 L32 90 L32 108 L60 114z" fill="#fff"/><path d="M60 96 L88 90 L88 108 L60 114z" fill="#f1eeff"/>
      <path d="M37 95.5l17 3.6M37 100.5l17 3.6M66 99.1l17-3.6M66 104.1l17-3.6" stroke="#c9c1f5" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M60 96v18" stroke="#b3a8ef" stroke-width="1.4"/>
      <ellipse cx="33" cy="99" rx="5.5" ry="5" fill="var(--lx-1)"/><ellipse cx="87" cy="99" rx="5.5" ry="5" fill="var(--lx-1)"/>`;
    if (kind === "star") return `
      <path d="M60 84l6.2 12.5 13.8 2-10 9.7 2.4 13.7L60 115.4l-12.4 6.5 2.4-13.7-10-9.7 13.8-2z" fill="#ffc94d" stroke="#f0a92e" stroke-width="1.4" stroke-linejoin="round"/>
      <ellipse cx="42" cy="101" rx="6" ry="5.5" fill="var(--lx-1)"/><ellipse cx="78" cy="101" rx="6" ry="5.5" fill="var(--lx-1)"/>`;
    if (kind === "pencil") return `${arms(92)}
      <g transform="rotate(-38 88 88)"><rect x="82" y="66" width="10" height="36" rx="2" fill="#ffc94d"/><rect x="82" y="66" width="10" height="6" rx="2" fill="#ff8fb3"/>
      <path d="M82 102 L92 102 L87 112z" fill="#f6d9b4"/><path d="M85.6 108.6 L88.4 108.6 L87 112z" fill="#2a2150"/></g>
      <ellipse cx="94" cy="96" rx="6" ry="5.5" fill="var(--lx-1)"/>`;
    if (kind === "cards") return `
      <ellipse cx="27" cy="96" rx="7" ry="6" fill="var(--lx-2)"/><ellipse cx="93" cy="96" rx="7" ry="6" fill="var(--lx-2)"/>
      <rect x="38" y="90" width="26" height="20" rx="4" fill="#ffd6e3" transform="rotate(-12 51 100)"/>
      <rect x="56" y="88" width="26" height="20" rx="4" fill="#fff" transform="rotate(10 69 98)"/>
      <path d="M63 96l12 2M62.4 100.5l9 1.6" stroke="#c9c1f5" stroke-width="1.8" stroke-linecap="round" transform="rotate(10 69 98)"/>
      <ellipse cx="37" cy="101" rx="5.5" ry="5" fill="var(--lx-1)"/><ellipse cx="83" cy="101" rx="5.5" ry="5" fill="var(--lx-1)"/>`;
    return arms(84);
  }

  function svg(mood, propKind) {
    mood = EYES[mood] ? mood : "happy";
    const id = "lxg" + (++uid);
    const [eL, eR] = EYES[mood];
    const blush = mood === "joy" || mood === "proud" || mood === "wink" ? ".8" : ".5";
    return `<svg viewBox="0 0 120 124" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--lx-1)"/><stop offset="1" stop-color="var(--lx-2)"/></linearGradient></defs>
      <ellipse class="lx-shadow" cx="60" cy="118" rx="30" ry="4.5"/>
      <g class="lx-body">
        <path d="M60 30 C 60 22, 64 18, 68 14" fill="none" stroke="var(--lx-2)" stroke-width="3" stroke-linecap="round"/>
        <path class="lx-star" d="M69 4.5l2.1 4.3 4.7.6-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.6z" fill="#ffc94d"/>
        <rect x="16" y="28" width="88" height="80" rx="36" fill="url(#${id})"/>
        <ellipse cx="60" cy="86" rx="28" ry="17" fill="var(--lx-belly)"/>
        ${brows(mood)}${eye("L", eL, mood)}${eye("R", eR, mood)}
        <ellipse cx="31" cy="75" rx="6" ry="3.6" fill="#ff8fb3" opacity="${blush}"/>
        <ellipse cx="89" cy="75" rx="6" ry="3.6" fill="#ff8fb3" opacity="${blush}"/>
        ${MOUTH[MOUTH_OF[mood]]}
        ${prop(propKind || "book")}
        ${extras(mood)}
      </g>
    </svg>`;
  }

  function set(el, mood, propKind) {
    if (!el) return;
    el.dataset.mood = mood;
    el.dataset.prop = propKind || "book";
    el.innerHTML = svg(mood, propKind);
  }
  function hop(el) {
    if (!el) return;
    el.classList.remove("hop");
    void el.offsetWidth;
    el.classList.add("hop");
  }
  // ganti ekspresi sebentar, lalu kembali
  function react(el, mood, ms) {
    if (!el) return;
    const base = el.dataset.base || el.dataset.mood || "happy";
    el.dataset.base = base;
    set(el, mood, el.dataset.prop);
    hop(el);
    clearTimeout(el._lxT);
    el._lxT = setTimeout(() => set(el, base, el.dataset.prop), ms || 1400);
  }

  // ---------------- mata mengikuti, berkedip ----------------
  const visibleFigs = () => Array.from(document.querySelectorAll(".lexi-fig")).filter(el => el.offsetParent !== null);
  function lookAt(x, y) {
    visibleFigs().forEach(fig => {
      const s = fig.querySelector("svg");
      if (!s) return;
      const r = s.getBoundingClientRect();
      if (!r.width) return;
      const k = 120 / r.width;
      s.querySelectorAll(".lx-eye").forEach(e => {
        const ex = r.left + (+e.dataset.cx) / k, ey = r.top + (+e.dataset.cy) / k;
        const dx = (x - ex) * k, dy = (y - ey) * k, d = Math.hypot(dx, dy) || 1, lim = Math.min(4.2, d / 12);
        e.querySelector(".lx-pupil").setAttribute("transform", `translate(${(dx / d * lim).toFixed(2)} ${(dy / d * lim).toFixed(2)})`);
      });
    });
  }
  window.addEventListener("pointermove", e => lookAt(e.clientX, e.clientY), { passive: true });
  window.addEventListener("pointerdown", e => lookAt(e.clientX, e.clientY), { passive: true });
  (function blinkLoop() {
    visibleFigs().forEach(fig => {
      if (Math.random() < .7) { fig.classList.add("blink"); setTimeout(() => fig.classList.remove("blink"), 150); }
    });
    setTimeout(blinkLoop, 2400 + Math.random() * 2600);
  })();

  // ---------------- Lexi di halaman lain ----------------
  const PAGE = {
    round: ["excited", "book"], free: ["thinking", "none"], cards: ["wink", "cards"],
    words: ["happy", "pencil"], progress: ["proud", "star"]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function fig(cls, mood, propKind) {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "lexi-fig " + cls;
    d.setAttribute("aria-label", window.VL_LANG === "en" ? "Lexi, the mascot" : "Lexi, maskot Vocab Lab");
    set(d, mood, propKind);
    d.addEventListener("click", () => react(d, pick(["joy", "excited", "wink"]), 1200));
    return d;
  }
  function decorate() {
    document.querySelectorAll("main > section:not([hidden])").forEach(sec => {
      const view = sec.id.replace("view-", "");
      if (view === "home") return;
      const h = sec.querySelector(".vtitle");
      const done = h && /Sesi selesai|Session complete/.test(h.textContent);
      let [mood, propKind] = PAGE[view] || ["happy", "book"];
      if (done) { mood = "joy"; propKind = "star"; }
      let pf = sec.querySelector(":scope > .page-lexi");
      if (h) {
        if (!pf) { pf = fig("page-lexi", mood, propKind); sec.prepend(pf); }
        else if (!pf._lxT && (pf.dataset.mood !== mood || pf.dataset.prop !== propKind)) set(pf, mood, propKind);
        sec.classList.add("has-lexi");
        const next = h.nextElementSibling;
        sec.classList.toggle("lexi-short", !(next && next.classList.contains("vsub")));
      } else {
        if (pf) pf.remove();
        sec.classList.remove("has-lexi", "lexi-short");
      }
    });
    document.querySelectorAll(".feedback.ok:not([hidden]), .feedback.no:not([hidden])").forEach(fb => {
      if (fb.querySelector(":scope > .fb-lexi")) return;
      const ok = fb.classList.contains("ok");
      const f = fig("fb-lexi", ok ? pick(["joy", "excited", "wink"]) : pick(["sad", "surprised"]), "none");
      fb.prepend(f);
      hop(f);
    });
    document.querySelectorAll(".empty").forEach(em => {
      if (em.querySelector(":scope > .empty-lexi")) return;
      em.prepend(fig("empty-lexi", "sleepy", "none"));
    });
    document.querySelectorAll(".sumhead").forEach(sh => {
      if (sh.querySelector(":scope > .sum-lexi")) return;
      const f = fig("sum-lexi", "joy", "star");
      sh.append(f);
      hop(f);
    });
  }
  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; decorate(); }); } };

  function start() {
    bindThemeButton();
    decorate();
    const main = document.querySelector("main");
    if (main) new MutationObserver(schedule).observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  window.Lexi = { svg, set, hop, react };
})();
