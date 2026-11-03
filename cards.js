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
  const save = () => ls.set(STORE, cards);
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
        <button type="button" data-t="list" class="${tab === "list" ? "active" : ""}">${T("Daftar kartu", "Card list")} (${cards.length})</button>
      </div></div>
      <div id="cardBody"></div>`;
    host.querySelectorAll("#cardTab button").forEach(b => b.onclick = () => { tab = b.dataset.t; render(); });
    if (tab === "practice") renderStart($("cardBody"));
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
    const deckSize = prefs.deck === "all" ? cards.length : c.todo + c.new;
    body.innerHTML = `
      <div class="stats3 cardstats">
        <div class="group stat"><div class="sv cs-known">${c.known}</div><div class="sl">${T("hafal", "known")}</div></div>
        <div class="group stat"><div class="sv cs-todo">${c.todo}</div><div class="sl">${T("belum hafal", "still learning")}</div></div>
        <div class="group stat"><div class="sv">${c.new}</div><div class="sl">${T("belum pernah dilihat", "not seen yet")}</div></div>
      </div>
      <div class="glabel">${T("Pengaturan", "Settings")}</div>
      <div class="group">
        <div class="row between wrap">
          <div><div class="rt">${T("Kartu", "Cards")}</div><div class="rd">${T("Kartu yang sudah hafal bisa diulang lewat pilihan Semua.", "Known cards can be reviewed with All.")}</div></div>
          <div class="seg" id="deckSeg">
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
    $("cardStart").onclick = () => startSession(prefs.deck === "all" ? cards : cards.filter(x => status(x) !== "known"));
  }

  // =====================================================
  //  SESI SWIPE
  // =====================================================
  function startSession(list) {
    if (!list.length) return;
    // kartu belum hafal dulu, lalu yang baru, lalu yang sudah hafal (masing-masing diacak)
    const order = ["todo", "new", "known"].flatMap(s => shuffle(list.filter(c => status(c) === s)));
    session = { queue: order.map(c => c.id), i: 0, total: order.length, flipped: false, history: [], firstKnown: new Set(), missed: new Set(), busy: false };
    render();
    window.scrollTo(0, 0);
  }
  const cur = () => session && cards.find(c => c.id === session.queue[session.i]);

  function renderSession(host) {
    const c = cur();
    if (!c) return renderSummary(host);
    const done = session.i, left = session.queue.length - session.i;
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
      <div class="deck">
        <div class="swipe" id="swipe">
          <div class="flip ${session.flipped ? "flipped" : ""}" id="flip">
            <div class="face front">${front}<div class="cf-hint">${T("Ingat dulu, lalu ketuk untuk membalik", "Recall first, then tap to flip")}</div></div>
            <div class="face back">${back}<div class="cf-hint">${T("Sudah hafal? Swipe kanan. Belum? Swipe kiri.", "Got it? Swipe right. Not yet? Swipe left.")}</div></div>
          </div>
          <div class="stamp st-yes">${T("HAFAL", "KNOW IT")}</div>
          <div class="stamp st-no">${T("BELUM", "NOT YET")}</div>
        </div>
      </div>
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

  function bindDrag(el) {
    let sx = 0, sy = 0, dx = 0, dy = 0, down = false, pid = null;
    const yes = el.querySelector(".st-yes"), no = el.querySelector(".st-no");
    const paint = () => {
      el.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      yes.style.opacity = Math.max(0, Math.min(1, dx / 90));
      no.style.opacity = Math.max(0, Math.min(1, -dx / 90));
    };
    el.addEventListener("pointerdown", e => {
      if (session.busy || (e.pointerType === "mouse" && e.button !== 0)) return;
      down = true; pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0;
      el.style.transition = "none";
    });
    el.addEventListener("pointermove", e => {
      if (!down || e.pointerId !== pid) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        try { el.setPointerCapture(pid); } catch (_) {}
        paint();
      }
    });
    const end = e => {
      if (!down || (e && e.pointerId !== pid)) return;
      down = false;
      if (Math.abs(dx) > 90) return fly(dx > 0 ? 1 : -1);
      el.style.transition = "transform .2s ease";
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && e && e.type === "pointerup") flip();
      dx = 0; paint();
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function fly(dir) {
    if (!session || session.busy || !cur()) return;
    session.busy = true;
    const el = $("swipe");
    if (el) {
      el.style.transition = "transform .22s ease-in";
      el.style.transform = `translateX(${dir * (window.innerWidth + 200)}px) rotate(${dir * 24}deg)`;
      const st = el.querySelector(dir > 0 ? ".st-yes" : ".st-no");
      if (st) st.style.opacity = 1;
    }
    setTimeout(() => { session.busy = false; decide(dir > 0); }, 200);
  }

  function decide(known) {
    const c = cur();
    if (!c) return;
    session.history.push({
      id: c.id, i: session.i, queue: session.queue.slice(),
      prev: { known: c.known, right: c.right || 0, wrong: c.wrong || 0, last: c.last || 0 },
      first: session.firstKnown.has(c.id), missed: session.missed.has(c.id)
    });
    c.last = Date.now();
    if (known) {
      c.known = true; c.right = (c.right || 0) + 1;
      if (!session.missed.has(c.id)) session.firstKnown.add(c.id);
    } else {
      c.known = false; c.wrong = (c.wrong || 0) + 1;
      session.missed.add(c.id);
      // muncul lagi beberapa kartu kemudian di sesi yang sama
      const at = Math.min(session.queue.length, session.i + 1 + 3);
      session.queue.splice(at, 0, c.id);
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
        <div class="group stat"><div class="sv cs-known">${first}</div><div class="sl">${T("hafal di percobaan pertama", "known on the first try")}</div></div>
        <div class="group stat"><div class="sv cs-todo">${missed.length}</div><div class="sl">${T("sempat di-swipe kiri", "swiped left at least once")}</div></div>
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

  window.VL_renderCards = () => { listMsg = listMsg && listMsg.keep ? listMsg : null; render(); };
})();
