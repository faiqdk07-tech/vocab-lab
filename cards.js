// =====================================================
//  KARTU HAFALAN (swipe card)
//  Daftar katanya terpisah dari Kata saya / Vocab Lab.
//  Swipe kanan = hafal, swipe kiri = belum hafal.
// =====================================================
(function () {
  "use strict";

  const STORE = "vocabLab.cards.v1";
  const PREFS = "vocabLab.cardPrefs.v1";
  const EN = () => window.VL_LANG === "en";
  const T = (id, en) => (EN() ? en : id);
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  let cards = ls.get(STORE, []);
  if (!Array.isArray(cards)) cards = [];
  let prefs = ls.get(PREFS, {});
  if (!prefs || typeof prefs !== "object") prefs = {};
  if (!prefs.deck) prefs.deck = "todo";
  if (!prefs.dir) prefs.dir = "word";
  if (!prefs.mode) prefs.mode = "learn"; // learn = kartu kiri diulang, test = tiap kartu sekali
  const MAX_REPEAT = 2;                  // maksimal diulang per sesi
  // Riwayat harian: satu catatan per tanggal (jumlah hafal / belum / baru di akhir hari itu)
  const LOG = "vocabLab.cardLog.v1";
  let log = ls.get(LOG, {});
  if (!log || typeof log !== "object") log = {};
  const dayKey = d => { const x = d || new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  function logToday() {
    const c = counts();
    log[dayKey()] = { known: c.known, todo: c.todo, new: c.new };
    ls.set(LOG, log);
  }
  function save() { const ok = ls.set(STORE, cards); logToday(); return ok; }
  const savePrefs = () => ls.set(PREFS, prefs);

  const POS_MAP = { n: "noun", noun: "noun", v: "verb", verb: "verb", adj: "adjective", adjective: "adjective", adv: "adverb", adverb: "adverb" };
  const status = c => c.known === true ? "known" : c.known === false ? "todo" : "new";
  const counts = () => {
    const r = { known: 0, todo: 0, new: 0 };
    cards.forEach(c => r[status(c)]++);
    return r;
  };

  let tab = "practice";      // practice | list
  let session = null;        // sesi swipe yang sedang berjalan
  let listText = "", listMsg = null;

  // =====================================================
  //  PARSER: satu baris = satu kartu
  // =====================================================
  const SKIP_KEY = /^(pecah|parts?|kalimat|sentence|alasan|why|sinonim|synonyms?|antonim|antonyms?)\s*:/i;
  const LINE_RE = /^(.+?)\s*(?:\(([^)]*)\))?\s*(?:=|:|\t|\s[-–—]\s)\s*(.+)$/;
  function parseLines(text) {
    const ok = [], bad = [], seen = new Set();
    text.replace(/\r/g, "").split("\n").forEach(raw => {
      if (/^\s*```/.test(raw)) return;
      const line = raw.replace(/\*\*/g, "").replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim();
      if (!line || line.startsWith("#") || SKIP_KEY.test(line)) return;
      const m = line.match(LINE_RE);
      if (!m) { bad.push(raw); return; }
      const w = m[1].trim(), arti = m[3].trim();
      const pos = POS_MAP[(m[2] || "").trim().toLowerCase().replace(/\.$/, "")] || null;
      if (!w || !arti) { bad.push(raw); return; }
      const key = w.toLowerCase() + "|" + (pos || "");
      if (seen.has(key)) return;
      seen.add(key);
      ok.push({ w, pos, arti });
    });
    return { ok, bad };
  }

  // =====================================================
  //  TAMPILAN UTAMA
  // =====================================================
  function render() {
    const host = $("view-cards");
    if (!host || host.hidden) return;
    if (session) return renderSession(host);
    host.innerHTML = `
      <h2 class="vtitle">${T("Kartu hafalan", "Flashcards")}</h2>
      <p class="vsub">${T("Swipe kanan kalau sudah hafal, kiri kalau belum. Daftar katanya terpisah dari Kata saya.", "Swipe right if you know it, left if you don't. This word list is separate from My words.")}</p>
      <div class="toolbar"><div class="seg" id="cardTab">
        <button type="button" data-t="practice" class="${tab === "practice" ? "active" : ""}">${T("Latihan", "Practice")}</button>
        <button type="button" data-t="progress" class="${tab === "progress" ? "active" : ""}">${T("Progres", "Progress")}</button>
        <button type="button" data-t="list" class="${tab === "list" ? "active" : ""}">${T("Daftar kartu", "Card list")} (${cards.length})</button>
      </div></div>
      <div id="cardBody"></div>`;
    host.querySelectorAll("#cardTab button").forEach(b => b.onclick = () => { tab = b.dataset.t; render(); });
    if (tab === "practice") renderStart($("cardBody"));
    else if (tab === "progress") renderProgress($("cardBody"));
    else renderList($("cardBody"));
  }

  // ---------- layar mulai ----------
  function renderStart(body) {
    if (!cards.length) {
      body.innerHTML = `<div class="group pad empty"><div class="rt">${T("Belum ada kartu", "No cards yet")}</div>
        <div class="rd">${T("Tempel daftar kata di tab Daftar kartu, satu kata per baris.", "Paste a word list in the Card list tab, one word per line.")}</div>
        <div class="btns"><button type="button" class="btn primary" id="toList">${T("Tambah kartu", "Add cards")}</button><button type="button" class="btn" id="toImport">${T("Impor file kartu (.json)", "Import card file (.json)")}</button></div></div>`;
      $("toList").onclick = () => { tab = "list"; render(); };
      $("toImport").onclick = () => { tab = "list"; render(); $("cardImpFile").click(); };
      return;
    }
    const c = counts();
    const focusSet = new Set(prefs.focusIds || []);
    const focusCards = cards.filter(x => focusSet.has(x.id));
    if (prefs.deck === "focus" && !focusCards.length) prefs.deck = "todo";
    const deckSize = prefs.deck === "all" ? cards.length : prefs.deck === "focus" ? focusCards.length : c.todo + c.new;
    body.innerHTML = `
      <div class="stats3 cardstats">
        <div class="group stat"><div class="sv"><i class="dot d-known"></i>${c.known}</div><div class="sl">${T("hafal", "known")}</div></div>
        <div class="group stat"><div class="sv"><i class="dot d-todo"></i>${c.todo}</div><div class="sl">${T("belum hafal", "still learning")}</div></div>
        <div class="group stat"><div class="sv">${c.new}</div><div class="sl">${T("belum pernah dilihat", "not seen yet")}</div></div>
      </div>
      ${prefs.deck === "focus" ? `<div class="note">${T(`Dek Fokus ronde berisi ${focusCards.length} kartu dari kata yang belum dikuasai di ronde terpandu. Kartunya ditambahkan otomatis.`, `The Round focus deck has ${focusCards.length} cards from words you haven't mastered in guided rounds. They were added automatically.`)}</div>` : ""}
      <div class="glabel">${T("Pengaturan", "Settings")}</div>
      <div class="group">
        <div class="row between wrap">
          <div><div class="rt">${T("Kartu", "Cards")}</div><div class="rd">${T("Kartu yang sudah hafal bisa diulang lewat pilihan Semua.", "Known cards can be reviewed with All.")}</div></div>
          <div class="seg" id="deckSeg">
            ${focusCards.length ? `<button type="button" data-d="focus" class="${prefs.deck === "focus" ? "active" : ""}">${T("Fokus ronde", "Round focus")} (${focusCards.length})</button>` : ""}
            <button type="button" data-d="todo" class="${prefs.deck === "todo" ? "active" : ""}">${T("Belum hafal + baru", "Learning + new")} (${c.todo + c.new})</button>
            <button type="button" data-d="all" class="${prefs.deck === "all" ? "active" : ""}">${T("Semua", "All")} (${cards.length})</button>
          </div>
        </div>
        <div class="row between wrap">
          <div><div class="rt">${T("Arah kartu", "Card direction")}</div><div class="rd">${T("Arti → Kata melatih mengingat katanya, bukan definisinya.", "Meaning → Word trains recalling the word, not its definition.")}</div></div>
          <div class="seg" id="dirSeg">
            <button type="button" data-r="word" class="${prefs.dir === "word" ? "active" : ""}">${T("Kata → Arti", "Word → Meaning")}</button>
            <button type="button" data-r="meaning" class="${prefs.dir === "meaning" ? "active" : ""}">${T("Arti → Kata", "Meaning → Word")}</button>
          </div>
        </div>
        <div class="row between wrap">
          <div><div class="rt">${T("Mode", "Mode")}</div><div class="rd">${prefs.mode === "test"
            ? T("Tes: setiap kartu muncul sekali. Cocok untuk tes mingguan.", "Test: every card appears once. Good for a weekly test.")
            : T(`Belajar: kartu yang di-swipe kiri muncul lagi beberapa kartu kemudian, maksimal ${MAX_REPEAT} kali per sesi.`, `Learn: left-swiped cards come back a few cards later, at most ${MAX_REPEAT} times per session.`)}</div></div>
          <div class="seg" id="modeSegC">
            <button type="button" data-m="learn" class="${prefs.mode === "learn" ? "active" : ""}">${T("Belajar", "Learn")}</button>
            <button type="button" data-m="test" class="${prefs.mode === "test" ? "active" : ""}">${T("Tes", "Test")}</button>
          </div>
        </div>
      </div>
      <div class="actions">
        <span class="keys">${deckSize ? "" : T("Semua kartu sudah hafal. Pilih Semua untuk mengulang.", "Every card is known. Choose All to review.")}</span>
        <button type="button" class="btn primary big" id="cardStart"${deckSize ? "" : " disabled"}>${T("Mulai", "Start")} · ${deckSize} ${T("kartu", deckSize === 1 ? "card" : "cards")}</button>
      </div>
      <div class="group pad howto">
        <div class="rt">${T("Cara pakai", "How it works")}</div>
        <ol>
          <li>${T("Lihat sisi depan, coba ingat jawabannya dulu.", "Look at the front and try to recall the answer first.")}</li>
          <li>${T("Ketuk kartu (atau Spasi) untuk membalik dan mengecek.", "Tap the card (or Space) to flip and check.")}</li>
          <li>${T("Swipe kanan (→) kalau benar, kiri (←) kalau belum. Kartu kiri muncul lagi di sesi yang sama.", "Swipe right (→) if you got it, left (←) if not. Left cards come back later in the same session.")}</li>
        </ol>
      </div>`;
    body.querySelectorAll("#deckSeg button").forEach(b => b.onclick = () => { prefs.deck = b.dataset.d; savePrefs(); render(); });
    body.querySelectorAll("#dirSeg button").forEach(b => b.onclick = () => { prefs.dir = b.dataset.r; savePrefs(); render(); });
    body.querySelectorAll("#modeSegC button").forEach(b => b.onclick = () => { prefs.mode = b.dataset.m; savePrefs(); render(); });
    $("cardStart").onclick = () => startSession(prefs.deck === "all" ? cards : prefs.deck === "focus" ? focusCards : cards.filter(x => status(x) !== "known"));
  }

  // =====================================================
  //  SESI SWIPE
  // =====================================================
  function startSession(list) {
    if (!list.length) return;
    // kartu belum hafal dulu, lalu yang baru, lalu yang sudah hafal (masing-masing diacak)
    const order = ["todo", "new", "known"].flatMap(s => shuffle(list.filter(c => status(c) === s)));
    session = { queue: order.map(c => c.id), i: 0, total: order.length, flipped: false, history: [], firstKnown: new Set(), missed: new Set(), misses: {}, mode: prefs.mode, busy: false };
    render();
    window.scrollTo(0, 0);
  }
  const cur = () => session && cards.find(c => c.id === session.queue[session.i]);

  function renderSession(host) {
    const c = cur();
    if (!c) return renderSummary(host);
    const done = session.i, left = session.queue.length - session.i;
    const entering = !!session.entering;
    session.entering = false;
    const nx = cards.find(x => x.id === session.queue[session.i + 1]);
    const frontOf = k => prefs.dir === "meaning"
      ? `<div class="cf-arti">${esc(k.arti)}</div>${k.pos ? `<span class="pos pos-${k.pos}">${k.pos}</span>` : ""}`
      : `<div class="cf-word">${esc(k.w)}</div>${k.pos ? `<span class="pos pos-${k.pos}">${k.pos}</span>` : ""}`;
    const nextFront = nx && nx.id !== c.id ? frontOf(nx) : "";
    const front = prefs.dir === "meaning"
      ? `<div class="cf-arti">${esc(c.arti)}</div>${c.pos ? `<span class="pos pos-${c.pos}">${c.pos}</span>` : ""}`
      : `<div class="cf-word">${esc(c.w)}</div>${c.pos ? `<span class="pos pos-${c.pos}">${c.pos}</span>` : ""}`;
    const back = prefs.dir === "meaning"
      ? `<div class="cf-word">${esc(c.w)}</div><div class="cf-sub">${esc(c.arti)}</div>`
      : `<div class="cf-arti">${esc(c.arti)}</div><div class="cf-sub">${esc(c.w)}</div>`;
    host.innerHTML = `
      <div class="sesshead">
        <div><b>${T("Kartu hafalan", "Flashcards")}</b><span class="muted"> · ${T("sisa", "left")} ${left}</span></div>
        <button type="button" class="btn small ghost" id="sessEnd">${T("Akhiri", "End")}</button>
      </div>
      <div class="pbar"><span style="width:${Math.round(100 * done / session.queue.length)}%"></span></div>
      <div class="deck"><div class="deck-stack">
        ${nextFront ? `<div class="swipe-next" id="swipeNext" aria-hidden="true"><div class="face">${nextFront}<div class="cf-hint">${T("Ingat dulu, lalu ketuk untuk membalik", "Recall first, then tap to flip")}</div></div></div>` : ""}
        <div class="swipe${entering ? " enter" : ""}" id="swipe">
          <div class="flip ${session.flipped ? "flipped" : ""}" id="flip">
            <div class="face front">${front}<div class="cf-hint">${T("Ingat dulu, lalu ketuk untuk membalik", "Recall first, then tap to flip")}</div></div>
            <div class="face back">${back}<div class="cf-hint">${T("Sudah hafal? Swipe kanan. Belum? Swipe kiri.", "Got it? Swipe right. Not yet? Swipe left.")}</div></div>
          </div>
          <div class="stamp st-yes">${T("HAFAL", "KNOW IT")}</div>
          <div class="stamp st-no">${T("BELUM", "NOT YET")}</div>
        </div>
      </div></div>
      <div class="swipebtns">
        <button type="button" class="btn sb-no" id="btnNo">← ${T("Belum", "Not yet")}</button>
        <button type="button" class="btn" id="btnFlip">${T("Balik", "Flip")}</button>
        <button type="button" class="btn sb-yes" id="btnYes">${T("Hafal", "Know it")} →</button>
      </div>
      <div class="actions"><span class="keys">${T("Spasi balik · ← belum · → hafal · Z batalkan", "Space flip · ← not yet · → know it · Z undo")}</span>
        <button type="button" class="btn small" id="btnUndo"${session.history.length ? "" : " disabled"}>${T("Batalkan swipe", "Undo swipe")}</button></div>`;

    $("sessEnd").onclick = () => {
      if (session.i === 0 || confirm(T("Akhiri sesi ini? Swipe yang sudah dilakukan tetap tersimpan.", "End this session? Swipes you've made stay saved."))) { session = null; render(); }
    };
    $("btnNo").onclick = () => fly(-1);
    $("btnYes").onclick = () => fly(1);
    $("btnFlip").onclick = flip;
    $("btnUndo").onclick = undo;
    bindDrag($("swipe"));
  }

  function flip() {
    if (!session || session.busy) return;
    session.flipped = !session.flipped;
    const f = $("flip");
    if (f) f.classList.toggle("flipped", session.flipped);
  }

  // ---------- geser kartu: diselaraskan dengan refresh layar, dengan kecepatan & pegas ----------
  function bindDrag(el) {
    const yes = el.querySelector(".st-yes"), no = el.querySelector(".st-no");
    const nextCard = document.getElementById("swipeNext");
    let down = false, dragging = false, pid = null, sx = 0, sy = 0, dx = 0, dy = 0, tilt = 1;
    let raf = 0, samples = [], buzzed = false;
    const width = () => el.getBoundingClientRect().width || 320;
    const threshold = () => Math.min(120, width() * 0.28);

    function paint() {
      raf = 0;
      const p = Math.min(1, Math.abs(dx) / threshold());
      el.style.transform = `translate3d(${dx}px, ${dy * 0.15}px, 0) rotate(${(dx / 16) * tilt}deg)`;
      yes.style.opacity = dx > 0 ? p : 0;
      no.style.opacity = dx < 0 ? p : 0;
      if (nextCard) nextCard.style.transform = `translate3d(0, ${10 - 10 * p}px, 0) scale(${0.94 + 0.06 * p})`;
      if (nextCard) nextCard.style.opacity = String(0.55 + 0.45 * p);
      if (p >= 1 && !buzzed) { buzzed = true; try { navigator.vibrate && navigator.vibrate(8); } catch (_) {} }
      if (p < 1) buzzed = false;
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };

    el.addEventListener("pointerdown", e => {
      if (!session || session.busy || (e.pointerType === "mouse" && e.button !== 0)) return;
      down = true; dragging = false; pid = e.pointerId;
      sx = e.clientX; sy = e.clientY; dx = dy = 0; samples = [{ x: e.clientX, t: e.timeStamp }];
      const r = el.getBoundingClientRect();
      tilt = e.clientY - r.top < r.height / 2 ? 1 : -1; // dipegang di atas: miring searah; di bawah: berlawanan
      el.style.transition = "none";
      if (nextCard) nextCard.style.transition = "none";
    });
    el.addEventListener("pointermove", e => {
      if (!down || e.pointerId !== pid) return;
      const mx = e.clientX - sx, my = e.clientY - sy;
      if (!dragging) {
        if (Math.abs(mx) < 5 || Math.abs(mx) < Math.abs(my)) return;
        dragging = true;
        document.body.classList.add("is-swiping");
        try { el.setPointerCapture(pid); } catch (_) {}
      }
      dx = mx; dy = my;
      samples.push({ x: e.clientX, t: e.timeStamp });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 90) samples.shift();
      schedule();
    });
    const end = e => {
      if (!down || (e && e.pointerId !== pid)) return;
      down = false;
      document.body.classList.remove("is-swiping");
      const wasDrag = dragging;
      dragging = false;
      if (!wasDrag) {
        if (e && e.type === "pointerup" && Math.abs(e.clientX - sx) < 6 && Math.abs(e.clientY - sy) < 6) flip();
        return;
      }
      const a = samples[0], b = samples[samples.length - 1];
      const vx = b && a && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px per ms
      const flick = Math.abs(vx) > 0.55 && Math.sign(vx) === Math.sign(dx) && Math.abs(dx) > 30;
      if (Math.abs(dx) > threshold() || flick) return fly(dx > 0 ? 1 : -1, Math.abs(vx));
      // kembali ke tengah dengan sedikit pantulan
      el.style.transition = "transform .5s cubic-bezier(.2,.9,.25,1.2)";
      if (nextCard) nextCard.style.transition = "transform .4s ease, opacity .4s ease";
      yes.style.transition = no.style.transition = "opacity .25s ease";
      dx = 0; dy = 0;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      paint();
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function fly(dir, speed) {
    if (!session || session.busy || !cur()) return;
    session.busy = true;
    const el = $("swipe"), nextCard = document.getElementById("swipeNext");
    const done = () => { if (!session.busy) return; session.busy = false; session.entering = true; decide(dir > 0); };
    if (!el) return done();
    const cur3d = getComputedStyle(el).transform;
    const startX = cur3d && cur3d !== "none" ? new DOMMatrix(cur3d).m41 : 0;
    const dist = window.innerWidth * 0.75 + el.offsetWidth;
    const remaining = Math.abs(dir * dist - startX);
    const v = Math.max(1.4, speed || 0); // px/ms; tombol pakai kecepatan bawaan
    const ms = Math.round(Math.min(340, Math.max(170, remaining / v)));
    el.style.transition = `transform ${ms}ms cubic-bezier(.3,.6,.4,1)`;
    el.style.transform = `translate3d(${dir * dist}px, 0, 0) rotate(${dir * 18}deg)`;
    const st = el.querySelector(dir > 0 ? ".st-yes" : ".st-no");
    if (st) { st.style.transition = "opacity .12s"; st.style.opacity = 1; }
    if (nextCard) {
      nextCard.style.transition = `transform ${ms}ms cubic-bezier(.2,.8,.2,1), opacity ${ms}ms ease`;
      nextCard.style.transform = "translate3d(0,0,0) scale(1)";
      nextCard.style.opacity = "1";
    }
    try { navigator.vibrate && navigator.vibrate(dir > 0 ? 12 : [6, 30, 6]); } catch (_) {}
    let fired = false;
    const finish = () => { if (fired) return; fired = true; done(); };
    const onEnd = ev => { if (ev.target === el && ev.propertyName === "transform") { el.removeEventListener("transitionend", onEnd); finish(); } };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, ms + 60);
  }

  function decide(known) {
    const c = cur();
    if (!c) return;
    session.history.push({
      id: c.id, i: session.i, queue: session.queue.slice(),
      prev: { known: c.known, right: c.right || 0, wrong: c.wrong || 0, last: c.last || 0 },
      first: session.firstKnown.has(c.id), missed: session.missed.has(c.id), misses: session.misses[c.id] || 0
    });
    c.last = Date.now();
    if (known) {
      c.known = true; c.right = (c.right || 0) + 1;
      if (!session.missed.has(c.id)) session.firstKnown.add(c.id);
    } else {
      c.known = false; c.wrong = (c.wrong || 0) + 1;
      session.missed.add(c.id);
      const n = (session.misses[c.id] || 0) + 1;
      session.misses[c.id] = n;
      // mode belajar: muncul lagi makin jauh (±6 lalu ±12 kartu), maksimal MAX_REPEAT kali per sesi
      if (session.mode !== "test" && n <= MAX_REPEAT) {
        const at = Math.min(session.queue.length, session.i + 1 + 6 * n);
        session.queue.splice(at, 0, c.id);
      }
    }
    save();
    session.i++;
    session.flipped = false;
    render();
  }

  function undo() {
    if (!session || session.busy || !session.history.length) return;
    const h = session.history.pop();
    const c = cards.find(x => x.id === h.id);
    if (c) Object.assign(c, h.prev);
    session.queue = h.queue; session.i = h.i; session.flipped = true;
    h.first ? session.firstKnown.add(h.id) : session.firstKnown.delete(h.id);
    h.missed ? session.missed.add(h.id) : session.missed.delete(h.id);
    session.misses[h.id] = h.misses;
    save();
    render();
  }

  function renderSummary(host) {
    const missed = cards.filter(c => session.missed.has(c.id));
    const first = session.firstKnown.size;
    host.innerHTML = `
      <h2 class="vtitle">${T("Sesi selesai", "Session complete")}</h2>
      <div class="stats3 cardstats">
        <div class="group stat"><div class="sv">${session.total}</div><div class="sl">${T("kartu", "cards")}</div></div>
        <div class="group stat"><div class="sv"><i class="dot d-known"></i>${first}</div><div class="sl">${T("hafal di percobaan pertama", "known on the first try")}</div></div>
        <div class="group stat"><div class="sv"><i class="dot d-todo"></i>${missed.length}</div><div class="sl">${T("sempat di-swipe kiri", "swiped left at least once")}</div></div>
      </div>
      ${missed.length ? `<div class="glabel">${T("Perlu diulang", "Worth repeating")}</div>
        <div class="group">${missed.map(c => `<div class="row between"><span class="fw">${esc(c.w)}</span><span class="muted">${esc(c.arti)}</span></div>`).join("")}</div>` : ""}
      <div class="actions">
        <button type="button" class="btn" id="sumDone">${T("Selesai", "Done")}</button>
        ${missed.length ? `<button type="button" class="btn" id="sumMissed">${T("Ulangi yang tadi salah", "Repeat the missed ones")}</button>` : ""}
        <button type="button" class="btn primary" id="sumNew">${T("Sesi baru", "New session")}</button>
      </div>`;
    $("sumDone").onclick = () => { session = null; render(); };
    if ($("sumMissed")) $("sumMissed").onclick = () => startSession(missed);
    $("sumNew").onclick = () => { session = null; const list = prefs.deck === "all" ? cards : cards.filter(x => status(x) !== "known"); list.length ? startSession(list) : render(); };
  }

  document.addEventListener("keydown", e => {
    const v = $("view-cards");
    if (!session || !v || v.hidden) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (!cur()) return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); fly(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); fly(-1); }
    else if (e.key === "z" || e.key === "Z" || e.key === "Backspace") { e.preventDefault(); undo(); }
  });

  // =====================================================
  //  PROGRES KARTU
  // =====================================================
  const MON_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const MON_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDay = k => { const [y, m, d] = k.split("-").map(Number); return `${d} ${(EN() ? MON_EN : MON_ID)[m - 1]}`; };

  function renderProgress(body) {
    if (!cards.length) {
      body.innerHTML = `<div class="group pad empty"><div class="rt">${T("Belum ada kartu", "No cards yet")}</div><div class="rd">${T("Progres muncul setelah kamu menambahkan kartu dan mulai swipe.", "Progress appears once you add cards and start swiping.")}</div></div>`;
      return;
    }
    logToday();
    const c = counts(), N = cards.length;
    const pct = v => Math.round(100 * v / N);
    const LBL = { known: T("Hafal", "Known"), todo: T("Belum hafal", "Still learning"), new: T("Belum dilihat", "Not seen yet") };

    // ---- bar komposisi ----
    const segs = ["known", "todo", "new"].filter(k => c[k] > 0);
    const comp = `<div class="compbar" role="img" aria-label="${esc(`${LBL.known} ${c.known}, ${LBL.todo} ${c.todo}, ${LBL.new} ${c.new}`)}">${segs.map(k =>
      `<span class="cseg s-${k}" style="flex:${c[k]}" title="${esc(`${LBL[k]}: ${c[k]} (${pct(c[k])}%)`)}"></span>`).join("")}</div>`;
    const legend = `<div class="clegend">${["known", "todo", "new"].map(k =>
      `<span><i class="dot d-${k}"></i>${LBL[k]} <b>${c[k]}</b> <span class="muted">(${pct(c[k])}%)</span></span>`).join("")}</div>`;

    // ---- data harian ----
    const days = Object.keys(log).sort().slice(-14);
    const rows = days.map(k => ({ k, ...log[k] }));

    // ---- kelompok kata ----
    const by = k => cards.filter(x => status(x) === k);
    const todo = by("todo").sort((a, b) => (b.wrong || 0) - (a.wrong || 0) || a.w.localeCompare(b.w));
    const neu = by("new").sort((a, b) => a.w.localeCompare(b.w));
    const known = by("known").sort((a, b) => a.w.localeCompare(b.w));
    const item = x => `<div class="witem"><span class="fw">${esc(x.w)}</span><span class="wa">${esc(x.arti)}</span>${(x.right || x.wrong) ? `<span class="wrw" title="${esc(T("benar / salah", "right / wrong"))}">✓${x.right || 0} ✗${x.wrong || 0}</span>` : ""}</div>`;
    const group = (k, list, open, note) => `
      <details class="group wgroup"${open ? " open" : ""}>
        <summary><span><i class="dot d-${k}"></i>${LBL[k]} <b>(${list.length})</b></span>${note ? `<span class="rd">${note}</span>` : ""}</summary>
        ${list.length ? `<div class="wlist">${list.map(item).join("")}</div>` : `<div class="row muted">${T("Belum ada.", "None yet.")}</div>`}
      </details>`;

    body.innerHTML = `
      <div class="glabel">${T("Komposisi sekarang", "Current breakdown")} · ${N} ${T("kartu", "cards")}</div>
      <div class="group pad">${comp}${legend}</div>

      <div class="glabel">${T("Perkembangan harian", "Daily progress")}</div>
      <div class="group pad">
        <div class="chartwrap" id="dayChart"></div>
        <div class="clegend"><span><i class="dot d-known"></i>${LBL.known}</span><span><i class="dot d-todo"></i>${LBL.todo}</span><span class="muted">${T("Sisa tinggi kolom = belum dilihat", "The rest of the column = not seen yet")}</span></div>
        ${rows.length < 2 ? `<div class="rd chartnote">${T("Grafik terisi satu kolom per hari kamu latihan. Kembali besok untuk melihat perubahannya.", "The chart adds one column for each day you practice. Come back tomorrow to see the change.")}</div>` : ""}
        <details class="det tabledet"><summary>${T("Lihat sebagai tabel", "View as table")}</summary>
          <table class="dtable"><thead><tr><th>${T("Tanggal", "Date")}</th><th>${LBL.known}</th><th>${LBL.todo}</th><th>${LBL.new}</th></tr></thead>
          <tbody>${rows.slice().reverse().map(r => `<tr><td>${fmtDay(r.k)}</td><td>${r.known}</td><td>${r.todo}</td><td>${r.new}</td></tr>`).join("")}</tbody></table>
        </details>
      </div>

      <div class="glabel">${T("Kata per status", "Words by status")}</div>
      ${group("todo", todo, true, todo.length ? T("urut dari yang paling sering salah", "most-missed first") : "")}
      ${group("new", neu, false, "")}
      ${group("known", known, false, "")}`;

    drawDayChart($("dayChart"), rows, N);
  }

  function drawDayChart(host, rows, N) {
    const W = Math.max(280, host.clientWidth || 600), H = 210;
    const m = { t: 22, r: 8, b: 26, l: 34 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const maxV = Math.max(1, ...rows.map(r => r.known + r.todo + r.new));
    const step = maxV <= 20 ? 5 : maxV <= 50 ? 10 : maxV <= 100 ? 25 : maxV <= 250 ? 50 : maxV <= 500 ? 100 : 250;
    const top = Math.ceil(maxV / step) * step;
    const y = v => m.t + ih - (v / top) * ih;
    const band = iw / Math.max(rows.length, 1);
    const bw = Math.min(24, band * 0.6);
    const ticks = []; for (let v = 0; v <= top; v += step) ticks.push(v);
    const every = Math.ceil(rows.length / Math.max(1, Math.floor(iw / 46)));
    const rt = (x, yTop, w, h, round) => {
      if (h <= 0) return "";
      const r = round ? Math.min(4, h, w / 2) : 0;
      return `M${x},${yTop + h}V${yTop + r}${r ? `Q${x},${yTop} ${x + r},${yTop}` : ""}H${x + w - r}${r ? `Q${x + w},${yTop} ${x + w},${yTop + r}` : ""}V${yTop + h}Z`;
    };
    let g = ticks.map(v => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${m.l - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}</text>`).join("");
    rows.forEach((r, i) => {
      const cx = m.l + band * i + band / 2, x = cx - bw / 2;
      const hk = (r.known / top) * ih, ht = (r.todo / top) * ih;
      const yk = m.t + ih - hk, yt = yk - ht - (ht > 0 && hk > 0 ? 2 : 0);
      g += `<path d="${rt(x, yk, bw, hk, ht <= 0)}" class="m-known"/>`;
      g += `<path d="${rt(x, yt, bw, ht, true)}" class="m-todo"/>`;
      if ((rows.length - 1 - i) % every === 0) g += `<text x="${cx}" y="${H - 8}" class="ax" text-anchor="${i === rows.length - 1 && rows.length > 1 ? "end" : "middle"}" dx="${i === rows.length - 1 && rows.length > 1 ? bw / 2 + 2 : 0}">${fmtDay(r.k)}</text>`;
      if (i === rows.length - 1 && r.known > 0) g += `<text x="${cx}" y="${Math.max(12, yt - 6)}" class="vl" text-anchor="${rows.length > 1 ? "end" : "middle"}" dx="${rows.length > 1 ? bw / 2 : 0}">${r.known} ${T("hafal", "known")}</text>`;
      g += `<rect x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" class="hit" data-i="${i}"/>`;
    });
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="${esc(T("Grafik jumlah kata hafal dan belum hafal per hari", "Chart of known and still-learning words per day"))}">${g}</svg><div class="ctip" hidden></div>`;
    const tip = host.querySelector(".ctip");
    const showTip = el => {
      const r = rows[+el.dataset.i];
      host.querySelectorAll(".hit").forEach(h => h.classList.toggle("on", h === el));
      tip.innerHTML = `<b>${fmtDay(r.k)}</b><div><i class="dot d-known"></i>${T("Hafal", "Known")}: ${r.known}</div><div><i class="dot d-todo"></i>${T("Belum hafal", "Still learning")}: ${r.todo}</div><div class="muted">${T("Belum dilihat", "Not seen yet")}: ${r.new}</div>`;
      tip.hidden = false;
      const bx = el.getBBox(), sc = host.clientWidth / W;
      const left = Math.min(host.clientWidth - tip.offsetWidth - 4, Math.max(4, (bx.x + bx.width / 2) * sc - tip.offsetWidth / 2));
      tip.style.left = left + "px"; tip.style.top = "4px";
    };
    host.querySelectorAll(".hit").forEach(el => {
      el.addEventListener("pointerenter", () => showTip(el));
      el.addEventListener("click", () => showTip(el));
    });
    host.addEventListener("pointerleave", () => { tip.hidden = true; host.querySelectorAll(".hit").forEach(h => h.classList.remove("on")); });
  }

  // =====================================================
  //  DAFTAR KARTU
  // =====================================================
  const EXAMPLE = "meticulous (adj) = sangat teliti\nubiquitous = ada di mana-mana\nmitigate (v) = mengurangi dampak\nscrutiny = pengawasan ketat";
  function renderList(body) {
    const LBL = { known: T("hafal", "known"), todo: T("belum hafal", "learning"), new: T("baru", "new") };
    const sorted = cards.slice().sort((a, b) => ["todo", "new", "known"].indexOf(status(a)) - ["todo", "new", "known"].indexOf(status(b)));
    body.innerHTML = `
      <div class="group form">
        <div class="fsec">
          <div class="fhead"><b>${T("Tambah kartu", "Add cards")}</b><span>${T("Satu kata per baris: kata = arti. Jenis kata boleh ditulis, boleh tidak: kata (n) = arti.", "One word per line: word = meaning. The word type is optional: word (n) = meaning.")}</span></div>
          <textarea id="cardPaste" rows="8" spellcheck="false" autocapitalize="off" placeholder="${esc(EXAMPLE)}"></textarea>
          <div class="actions">
            <span class="fmsg ${listMsg && listMsg.ok ? "ok" : "no"}" id="cardMsg">${listMsg ? esc(listMsg.text) : ""}</span>
            <button type="button" class="btn primary" id="cardAdd">${T("Simpan ke kartu", "Save as cards")}</button>
          </div>
          <div class="rd">${T("Hasil AI format Vocab Lab juga bisa ditempel. Baris kalimat, sinonim, dan lainnya dilewati, dan setiap baris kata menjadi satu kartu.", "Vocab Lab-format AI output works too. Sentence, synonym and other lines are skipped, and every word line becomes one card.")}</div>
        </div>
      </div>

      <div class="glabel between"><span>${T("Daftar kartu", "Card list")} (${cards.length})</span>
        ${cards.length ? `<span class="btns"><button type="button" class="btn small" id="cardResetAll">${T("Reset status", "Reset status")}</button><button type="button" class="btn small danger" id="cardDelAll">${T("Hapus semua", "Delete all")}</button></span>` : ""}</div>
      <div class="group">${sorted.length ? sorted.map(c => `
        <div class="row between">
          <div class="minw"><span class="fw">${esc(c.w)}</span>${c.pos ? ` <span class="pos pos-${c.pos}">${c.pos}</span>` : ""} <span class="muted">· ${esc(c.arti)}</span></div>
          <div class="btns"><span class="cstat cst-${status(c)}">${LBL[status(c)]}</span><button type="button" class="btn small danger" data-cdel="${esc(c.id)}">${T("Hapus", "Delete")}</button></div>
        </div>`).join("") : `<div class="row muted">${T("Belum ada kartu.", "No cards yet.")}</div>`}</div>

      <div class="glabel">${T("Cadangan", "Backup")}</div>
      <div class="group"><div class="row between wrap">
        <div><div class="rd">${T("Kartu hanya tersimpan di browser ini. Ekspor untuk cadangan atau pindah perangkat.", "Cards are only stored in this browser. Export to back up or move devices.")}</div></div>
        <div class="btns"><button type="button" class="btn" id="cardExp">${T("Ekspor", "Export")}</button><button type="button" class="btn" id="cardImp">${T("Impor", "Import")}</button><input type="file" id="cardImpFile" accept=".json,application/json" hidden></div>
      </div></div>`;

    const box = $("cardPaste");
    box.value = listText;
    box.oninput = () => { listText = box.value; };
    $("cardAdd").onclick = addCards;
    body.querySelectorAll("[data-cdel]").forEach(b => b.onclick = () => {
      const c = cards.find(x => x.id === b.dataset.cdel);
      if (!c || !confirm(T(`Hapus kartu "${c.w}"?`, `Delete the card "${c.w}"?`))) return;
      cards = cards.filter(x => x.id !== c.id); save(); listMsg = null; render();
    });
    if ($("cardDelAll")) $("cardDelAll").onclick = () => {
      if (!confirm(T(`Hapus semua ${cards.length} kartu? Ini tidak bisa dibatalkan.`, `Delete all ${cards.length} cards? This can't be undone.`))) return;
      cards = []; save(); listMsg = { text: T("Semua kartu sudah dihapus.", "All cards were deleted."), ok: true }; render();
    };
    if ($("cardResetAll")) $("cardResetAll").onclick = () => {
      if (!confirm(T("Jadikan semua kartu berstatus baru lagi?", "Mark every card as new again?"))) return;
      cards.forEach(c => { c.known = null; }); save(); listMsg = { text: T("Status semua kartu sudah direset.", "Every card's status was reset."), ok: true }; render();
    };
    $("cardExp").onclick = () => {
      if (!cards.length) { listMsg = { text: T("Belum ada kartu untuk diekspor.", "No cards to export yet."), ok: false }; return render(); }
      const blob = new Blob([JSON.stringify({ app: "vocab-lab-cards", version: 1, cards }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "vocab-lab-kartu.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $("cardImp").onclick = () => $("cardImpFile").click();
    $("cardImpFile").onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        let list = null;
        try { const d = JSON.parse(rd.result); list = Array.isArray(d) ? d : d.cards; } catch (_) { list = null; }
        if (!Array.isArray(list)) { listMsg = { text: T("File tidak bisa dibaca. Pastikan ini file Ekspor kartu.", "The file couldn't be read. Make sure it's a card export file."), ok: false }; return render(); }
        let n = 0;
        list.forEach(x => {
          if (!x || !x.w || !x.arti) return;
          const pos = POS[x.pos] ? x.pos : null;
          const id = "c:" + String(x.w).toLowerCase() + "|" + (pos || "");
          const i = cards.findIndex(c => c.id === id);
          const item = { id, w: String(x.w), pos, arti: String(x.arti), known: x.known === true ? true : x.known === false ? false : null, right: +x.right || 0, wrong: +x.wrong || 0, last: +x.last || 0 };
          if (i >= 0) cards[i] = item; else cards.push(item);
          n++;
        });
        save();
        listMsg = { text: T(`${n} kartu diimpor.`, `${n} cards imported.`), ok: true };
        render();
      };
      rd.readAsText(f);
    };
  }
  const POS = { noun: 1, verb: 1, adjective: 1, adverb: 1 };

  function addCards() {
    const { ok, bad } = parseLines(listText);
    if (!ok.length && !bad.length) { listMsg = { text: T("Kotaknya masih kosong.", "The box is empty."), ok: false }; return render(); }
    let added = 0, updated = 0;
    ok.forEach(x => {
      const id = "c:" + x.w.toLowerCase() + "|" + (x.pos || "");
      const i = cards.findIndex(c => c.id === id);
      if (i >= 0) { cards[i].arti = x.arti; updated++; }
      else { cards.push({ id, w: x.w, pos: x.pos, arti: x.arti, known: null, right: 0, wrong: 0, last: 0 }); added++; }
    });
    if (!save()) { listMsg = { text: T("Gagal menyimpan: penyimpanan browser tidak tersedia.", "Couldn't save: browser storage is unavailable."), ok: false }; return render(); }
    listText = bad.join("\n");
    let text = T(`${added} kartu baru${updated ? `, ${updated} diperbarui` : ""}.`, `${added} new card${added === 1 ? "" : "s"}${updated ? `, ${updated} updated` : ""}.`);
    if (bad.length) text += " " + T(`${bad.length} baris tidak terbaca dan masih di kotak (formatnya: kata = arti).`, `${bad.length} line(s) couldn't be read and are still in the box (format: word = meaning).`);
    listMsg = { text, ok: !bad.length };
    render();
  }

  // kata yang belum dikuasai dari ronde: tambahkan kartunya & jadikan dek "Fokus ronde"
  window.VL_syncFocusCards = list => {
    let added = 0;
    const ids = [];
    list.forEach(x => {
      const id = "c:" + x.w.toLowerCase() + "|" + (x.pos || "");
      ids.push(id);
      if (!cards.some(c => c.id === id)) { cards.push({ id, w: x.w, pos: x.pos, arti: x.arti, known: null, right: 0, wrong: 0, last: 0, auto: true }); added++; }
    });
    prefs.focusIds = ids;
    if (ids.length) prefs.deck = "focus"; else if (prefs.deck === "focus") prefs.deck = "todo";
    savePrefs();
    if (added) save();
    return added;
  };
  window.VL_openFocusDeck = () => { tab = "practice"; session = null; if ((prefs.focusIds || []).length) { prefs.deck = "focus"; savePrefs(); } };
  window.VL_cardCounts = () => counts();
  window.VL_cardLog = () => log;
  window.VL_renderCards = () => { listMsg = listMsg && listMsg.keep ? listMsg : null; render(); };
})();
