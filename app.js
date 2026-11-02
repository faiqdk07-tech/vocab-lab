(function () {
  "use strict";

  // =====================================================
  //  PENYIMPANAN (localStorage, hanya di browser ini)
  // =====================================================
  const STORE = "vocabLab.stats.v1";
  const CUSTOM = "vocabLab.custom.v1";
  const MASTER = 3; // jawaban benar per kata sebelum dianggap dikuasai

  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  let stats = ls.get(STORE, {});
  let custom = ls.get(CUSTOM, []);
  if (!stats || typeof stats !== "object") stats = {};
  if (!Array.isArray(custom)) custom = [];
  const saveStats = () => ls.set(STORE, stats);
  const saveCustom = () => ls.set(CUSTOM, custom);

  // =====================================================
  //  UTILITAS
  // =====================================================
  const POS = ["noun", "verb", "adjective", "adverb"];
  const POS_ID = { noun: "kata benda", verb: "kata kerja", adjective: "kata sifat", adverb: "kata keterangan" };
  const rand = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = id => document.getElementById(id);

  const fams = () => FAMILIES.concat(custom);
  const allForms = () => fams().flatMap(f => f.forms.map(x => ({ ...x, fam: f.id })));
  const focusOf = f => f.focus || f.forms[0].w;
  const focusArti = f => (f.forms.find(x => x.w === focusOf(f)) || f.forms[0]).arti;
  const syns = f => f.synonyms || [];
  const ants = f => f.antonyms || [];
  const hasParts = f => !!(f.parts && f.parts.list && f.parts.list.length && f.forms.some(x => x.w === f.parts.w));
  const hasSentence = f => !!(f.sentence && f.sentence.text && f.sentence.text.includes("___") && f.forms.some(x => x.w === f.sentence.answer));
  const posPill = p => `<span class="pos pos-${p}">${p}</span>`;

  const SUFFIX_HINTS = AFFIXES.suffix
    .flatMap(s => s.form.split("/").map(t => ({ end: t.trim().replace(/^-/, ""), pos: s.pos })))
    .sort((a, b) => b.end.length - a.end.length);
  function suffixHint(w, pos) {
    const h = SUFFIX_HINTS.find(h => w.endsWith(h.end));
    return h && h.pos === pos ? `akhiran <b>-${esc(h.end)}</b> biasanya membentuk ${h.pos}` : "";
  }
  function affixFor(part) {
    const p = String(part).trim().toLowerCase();
    for (const kind of ["prefix", "root", "suffix"]) {
      for (const item of AFFIXES[kind]) {
        if (item.form.split("/").map(t => t.trim().toLowerCase()).includes(p)) return { kind, item };
      }
    }
    return null;
  }
  function famCorrect(id) { let c = 0; for (const k in stats) if (stats[k].fam === id) c += stats[k].c; return c; }
  const isMastered = f => famCorrect(f.id) >= MASTER;
  const boxes = f => {
    const c = Math.min(famCorrect(f.id), MASTER);
    return `<span class="boxes" title="${c}/${MASTER} benar">${Array.from({ length: MASTER }, (_, i) => `<i class="${i < c ? "on" : ""}"></i>`).join("")}</span>`;
  };

  // =====================================================
  //  PEMBUAT SOAL
  // =====================================================
  function qPos(form) {
    const others = allForms().filter(f => f.pos !== form.pos);
    const pool = shuffle(others.filter(f => f.fam === form.fam)).concat(shuffle(others.filter(f => f.fam !== form.fam)));
    const picks = [];
    for (const f of pool) { if (picks.length >= 3) break; if (!picks.some(p => p.w === f.w) && f.w !== form.w) picks.push(f); }
    const opts = shuffle([form, ...picks]);
    const hint = suffixHint(form.w, form.pos);
    const art = /^[aeiou]/.test(form.pos) ? "an" : "a";
    return {
      tag: "Jenis kata",
      prompt: `Which is ${art} <b>${form.pos}</b>?`,
      sub: `Mana yang ${POS_ID[form.pos]}?`,
      options: opts.map(o => ({ label: o.w, correct: o.w === form.w })),
      explain: `<b>${esc(form.w)}</b> = ${form.pos} (${esc(form.arti)}).${hint ? " Petunjuk: " + hint + "." : ""}` +
        `<ul>${opts.filter(o => o.w !== form.w).map(o => `<li>${esc(o.w)} = ${o.pos} (${esc(o.arti)})</li>`).join("")}</ul>`
    };
  }

  function qFill(fam) {
    const s = fam.sentence;
    const ans = fam.forms.find(f => f.w === s.answer);
    // kata yang cuma punya 1 bentuk: pengecoh diambil dari kata lain dengan jenis yang sama
    const opts = fam.forms.slice();
    if (opts.length < 2) {
      const extra = shuffle(allForms().filter(f => f.fam !== fam.id && f.pos === ans.pos && !opts.some(o => o.w.toLowerCase() === f.w.toLowerCase())));
      while (opts.length < 4 && extra.length) opts.push(extra.pop());
    }
    return {
      tag: "Isi kalimat",
      prompt: esc(s.text).replace("___", '<span class="blank">______</span>'),
      sub: "Pilih bentuk kata yang tepat.",
      options: shuffle(opts).map(f => ({ label: f.w, correct: f.w === s.answer })),
      explain: `${s.why ? esc(s.why) + " " : ""}Jawaban: <b>${esc(ans.w)}</b> (${ans.pos}, ${esc(ans.arti)}).` +
        `<ul>${opts.filter(f => f.w !== ans.w).map(f => `<li>${esc(f.w)} = ${f.pos}${f.fam !== undefined ? ` (${esc(f.arti)})` : ""}</li>`).join("")}</ul>`
    };
  }

  function qAffix(kind, item) {
    const name = { prefix: "Prefix (awalan)", root: "Root (akar kata)", suffix: "Suffix (akhiran)" }[kind];
    const exLine = `Contoh: <i>${esc(item.ex)}</i>.${item.note ? " " + esc(item.note) : ""}`;
    if (kind === "suffix") {
      return {
        tag: "Imbuhan",
        prompt: `Akhiran <b>${esc(item.form)}</b> biasanya membentuk kata jenis apa?`,
        sub: name,
        options: shuffle(POS).map(p => ({ label: p, correct: p === item.pos })),
        explain: `<b>${esc(item.form)}</b> → ${item.pos} (${POS_ID[item.pos]}), artinya kira-kira "${esc(item.meaning)}". ${exLine}`
      };
    }
    const picks = [];
    for (const o of shuffle(AFFIXES[kind].filter(a => a.meaning !== item.meaning))) {
      if (picks.length >= 3) break;
      if (!picks.includes(o.meaning)) picks.push(o.meaning);
    }
    return {
      tag: "Imbuhan",
      prompt: `Apa arti <b>${esc(item.form)}</b>?`,
      sub: name,
      options: shuffle([item.meaning, ...picks]).map(m => ({ label: m, correct: m === item.meaning })),
      explain: `<b>${esc(item.form)}</b> = "${esc(item.meaning)}". ${exLine}`
    };
  }

  function qParts(fam) {
    const p = fam.parts;
    const form = fam.forms.find(f => f.w === p.w);
    const picks = [];
    for (const o of shuffle(allForms().filter(f => f.fam !== fam.id))) {
      if (picks.length >= 3) break;
      if (o.arti !== form.arti && !picks.includes(o.arti)) picks.push(o.arti);
    }
    return {
      tag: "Pecah kata",
      prompt: `<span class="chips">${p.list.map(x => `<span class="chip"><b>${esc(x[0])}</b></span>`).join('<span class="plus">+</span>')}</span>`,
      sub: `Dari potongan-potongannya, apa arti <b>${esc(p.w)}</b>?`,
      options: shuffle([form.arti, ...picks]).map(a => ({ label: a, correct: a === form.arti })),
      explain: `<ul>${p.list.map(x => `<li><b>${esc(x[0])}</b> = ${esc(x[1] || "—")}</li>`).join("")}</ul>` +
        `Jadi <b>${esc(p.w)}</b> (${form.pos}) = ${esc(form.arti)}.`
    };
  }

  function qRel(fam, kind) {
    const list = kind === "syn" ? syns(fam) : ants(fam);
    const ans = rand(list);
    const exclude = new Set([...syns(fam), ...ants(fam)].map(x => x.w.toLowerCase()).concat(fam.forms.map(f => f.w.toLowerCase())));
    const picks = [];
    for (const f of shuffle(fams())) {
      if (picks.length >= 3) break;
      const w = focusOf(f);
      if (f.id === fam.id || exclude.has(w.toLowerCase()) || picks.some(p => p.w === w)) continue;
      picks.push({ w, arti: focusArti(f) });
    }
    const label = kind === "syn" ? "Sinonim" : "Antonim";
    const fw = focusOf(fam);
    return {
      tag: label,
      prompt: `${label} dari <b>${esc(fw)}</b>?`,
      sub: `${esc(fw)} = ${esc(focusArti(fam))}. Pilih kata yang artinya ${kind === "syn" ? "paling mirip" : "berlawanan"}.`,
      options: shuffle([ans, ...picks]).map(o => ({ label: o.w, correct: o.w === ans.w })),
      explain: `<b>${esc(fw)}</b> (${esc(focusArti(fam))}) ${kind === "syn" ? "≈" : "↔"} <b>${esc(ans.w)}</b>${ans.arti ? ` (${esc(ans.arti)})` : ""}.` +
        `<ul>${picks.map(o => `<li>${esc(o.w)} = ${esc(o.arti)}</li>`).join("")}</ul>`
    };
  }

  const C = {
    pos: f => ({ key: "pos:" + f.w, fam: f.fam, make: () => qPos(f) }),
    fill: f => ({ key: "fill:" + f.id, fam: f.id, make: () => qFill(f) }),
    affix: (k, a) => ({ key: "affix:" + a.form, fam: null, make: () => qAffix(k, a) }),
    parts: f => ({ key: "parts:" + f.id, fam: f.id, make: () => qParts(f) }),
    rel: (f, kind) => ({ key: kind + ":" + f.id, fam: f.id, make: () => qRel(f, kind) })
  };

  function candidates(mode) {
    const c = [], want = m => mode === "mix" || mode === m;
    if (want("pos")) allForms().forEach(f => c.push(C.pos(f)));
    if (want("fill")) fams().filter(hasSentence).forEach(f => c.push(C.fill(f)));
    if (want("affix")) ["prefix", "root", "suffix"].forEach(k => AFFIXES[k].forEach(a => c.push(C.affix(k, a))));
    if (want("parts")) fams().filter(hasParts).forEach(f => c.push(C.parts(f)));
    if (want("rel")) fams().forEach(f => {
      if (mode === "mix" && !isMastered(f)) return;
      if (syns(f).length) c.push(C.rel(f, "syn"));
      if (ants(f).length) c.push(C.rel(f, "ant"));
    });
    return c;
  }
  function weight(key) {
    const s = stats[key];
    if (!s) return 1.5;
    return Math.max(0.2, 1 + 2 * s.w - 0.25 * Math.min(s.c, 4));
  }
  function pickWeighted(list, avoid) {
    if (list.length > 1) list = list.filter(x => x.key !== avoid);
    let r = Math.random() * list.reduce((t, x) => t + weight(x.key), 0);
    for (const x of list) { r -= weight(x.key); if (r <= 0) return x; }
    return list[list.length - 1];
  }
  function record(cand, ok) {
    const s = stats[cand.key] || { c: 0, w: 0, fam: cand.fam };
    ok ? s.c++ : s.w++;
    s.fam = cand.fam;
    stats[cand.key] = s;
    saveStats();
  }

  // =====================================================
  //  KOMPONEN SOAL
  // =====================================================
  let activeQuiz = null;
  function mountQuiz(host, cand, opt) {
    const q = cand.make();
    host.innerHTML =
      `<div class="group qcard">
         <div class="qhead"><span class="qtag">${esc(q.tag)}</span>${opt.meta ? `<span class="qmeta">${esc(opt.meta)}</span>` : ""}</div>
         <div class="qprompt">${q.prompt}</div>
         <div class="qsub">${q.sub}</div>
       </div>
       <div class="options"></div>
       <div class="feedback" hidden></div>
       <div class="actions"><span class="keys">1–4 jawab · Enter lanjut</span><button type="button" class="btn primary next" hidden>${esc(opt.nextLabel || "Soal berikutnya")}</button></div>`;
    const box = host.querySelector(".options"), fb = host.querySelector(".feedback"), nx = host.querySelector(".next");
    let answered = false;
    q.options.forEach((o, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.innerHTML = `<span class="num">${i + 1}</span><span>${esc(o.label)}</span>`;
      b.onclick = () => answer(i);
      box.appendChild(b);
    });
    function answer(i) {
      if (answered) return;
      answered = true;
      const ok = q.options[i].correct;
      record(cand, ok);
      [...box.children].forEach((b, j) => {
        b.disabled = true;
        if (q.options[j].correct) b.classList.add("correct");
        else if (j === i) b.classList.add("wrong");
      });
      fb.className = "feedback " + (ok ? "ok" : "no");
      fb.innerHTML = `<div class="verdict">${ok ? "Benar" : "Belum tepat"}</div>${q.explain}`;
      fb.hidden = false;
      nx.hidden = false;
      nx.focus({ preventScroll: true });
      if (opt.onAnswer) opt.onAnswer(ok);
      updateBadge();
    }
    nx.onclick = () => { activeQuiz = null; opt.onNext(); };
    activeQuiz = { answer, next: () => nx.click(), isAnswered: () => answered, count: q.options.length };
  }
  document.addEventListener("keydown", e => {
    if (!activeQuiz) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (!activeQuiz.isAnswered() && /^[1-4]$/.test(e.key)) {
      const i = +e.key - 1;
      if (i < activeQuiz.count) activeQuiz.answer(i);
    } else if (activeQuiz.isAnswered() && e.key === "Enter") {
      e.preventDefault();
      activeQuiz.next();
    }
  });

  // =====================================================
  //  RONDE TERPANDU
  // =====================================================
  const STEPS = [
    { id: "intro", title: "Kenalan", desc: "Baca keluarga kata: semua bentuknya, jenis katanya, arti, dan potongan katanya. Belum ada soal." },
    { id: "affix", title: "Imbuhan", desc: "Tebak arti prefix, root, dan suffix yang dipakai kata-kata ini." },
    { id: "parts", title: "Pecah kata", desc: "Dari potongan-potongannya, tebak arti kata utuhnya." },
    { id: "pos", title: "Jenis kata", desc: "Bedakan noun, verb, adjective, dan adverb dari bentuknya." },
    { id: "fill", title: "Isi kalimat", desc: "Pilih bentuk kata yang pas di dalam kalimat." },
    { id: "rel", title: "Sinonim & antonim", desc: "Ulangi kata yang sudah dikuasai lewat padanan dan lawan kata. Dilewati kalau belum ada." }
  ];
  let roundSize = 3, round = null;

  function pickWords(n) {
    const pool = fams().slice(), out = [];
    while (out.length < n && pool.length) {
      const w = pool.map(f => isMastered(f) ? 0.25 : 1.6 - 0.35 * Math.min(famCorrect(f.id), MASTER));
      let r = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
      for (; i < pool.length - 1; i++) { r -= w[i]; if (r <= 0) break; }
      out.push(pool[i]);
      pool.splice(i, 1);
    }
    return out;
  }

  function buildRound(n) {
    const words = pickWords(n);
    const items = { intro: [{ intro: true }], affix: [], parts: [], pos: [], fill: [], rel: [] };

    const seen = new Set();
    words.filter(hasParts).forEach(f => f.parts.list.forEach(([p]) => {
      const m = affixFor(p);
      if (m && !seen.has(m.item.form)) { seen.add(m.item.form); items.affix.push(C.affix(m.kind, m.item)); }
    }));
    items.affix = shuffle(items.affix).slice(0, 4);
    if (items.affix.length < 2) {
      const extra = shuffle(["prefix", "root", "suffix"].flatMap(k => AFFIXES[k].map(item => ({ kind: k, item })))).filter(x => !seen.has(x.item.form));
      while (items.affix.length < 2 && extra.length) { const x = extra.pop(); items.affix.push(C.affix(x.kind, x.item)); }
    }

    items.parts = words.filter(hasParts).map(C.parts);
    items.pos = words.map(f => C.pos({ ...rand(f.forms), fam: f.id }));
    items.fill = words.filter(hasSentence).map(C.fill);

    const mastered = shuffle(fams().filter(f => isMastered(f) && (syns(f).length || ants(f).length)));
    mastered.sort((a, b) => (words.includes(b) ? 1 : 0) - (words.includes(a) ? 1 : 0));
    items.rel = mastered.slice(0, n).map(f => {
      const kinds = [];
      if (syns(f).length) kinds.push("syn");
      if (ants(f).length) kinds.push("ant");
      return C.rel(f, rand(kinds));
    });

    return { words, steps: STEPS.map(s => ({ ...s, items: items[s.id], right: 0, done: 0 })), si: 0, qi: 0, phase: "run", answered: false };
  }

  function skipEmpty() {
    while (round.si < round.steps.length && round.steps[round.si].items.length === 0) round.si++;
    if (round.si >= round.steps.length) round.phase = "summary";
  }
  function startRound() { round = buildRound(roundSize); skipEmpty(); renderRound(); window.scrollTo(0, 0); }
  function advance() {
    round.answered = false;
    round.qi++;
    if (round.qi >= round.steps[round.si].items.length) { round.si++; round.qi = 0; skipEmpty(); window.scrollTo(0, 0); }
    renderRound();
  }
  function nextLabel() {
    const step = round.steps[round.si];
    if (round.qi < step.items.length - 1) return "Soal berikutnya";
    const later = round.steps.slice(round.si + 1).find(s => s.items.length);
    return later ? `Lanjut: ${later.title}` : "Lihat hasil";
  }

  function stepperHTML() {
    return `<div class="stepper">${round.steps.map((s, i) => {
      let cls = "";
      if (round.phase === "summary") cls = s.items.length ? "done" : "skip";
      else if (i === round.si) cls = "current";
      else if (i < round.si) cls = s.items.length ? "done" : "skip";
      return `<div class="step ${cls}"><span class="n">${cls === "done" ? "✓" : i + 1}</span><span class="t">${esc(s.title)}</span></div>`;
    }).join("")}</div>`;
  }

  function renderRound() {
    const host = $("view-round");
    if (!round) return renderStart(host);
    if (round.answered) return advance(); // pindah tab setelah menjawab → lanjut otomatis
    host.innerHTML = stepperHTML() + `<div id="roundStage"></div>`;
    const stage = $("roundStage");
    if (round.phase === "summary") return renderSummary(stage);
    const step = round.steps[round.si];
    stage.innerHTML = `<div class="steptitle"><div><b>Langkah ${round.si + 1} · ${esc(step.title)}</b><span>${esc(step.desc)}</span></div><button type="button" class="btn small ghost" id="quitRound">Akhiri</button></div><div id="roundBody"></div>`;
    $("quitRound").onclick = () => { if (confirm("Akhiri ronde ini? Jawaban yang sudah masuk tetap tercatat.")) { round = null; activeQuiz = null; renderRound(); } };
    const body = $("roundBody");
    if (step.id === "intro") return renderIntro(body);
    mountQuiz(body, step.items[round.qi], {
      meta: `Soal ${round.qi + 1} dari ${step.items.length}`,
      nextLabel: nextLabel(),
      onAnswer: ok => { step.done++; if (ok) step.right++; round.answered = true; },
      onNext: advance
    });
  }

  function renderStart(host) {
    host.innerHTML = `
      <h2 class="vtitle">Ronde terpandu</h2>
      <p class="vsub">Satu ronde melatih beberapa kata lewat 6 langkah berurutan, dari mengenali bentuknya sampai memakainya di kalimat.</p>
      <div class="glabel">Urutan langkah</div>
      <div class="group">${STEPS.map((s, i) => `<div class="row"><span class="stepno">${i + 1}</span><div><div class="rt">${esc(s.title)}</div><div class="rd">${esc(s.desc)}</div></div></div>`).join("")}</div>
      <div class="glabel">Pengaturan</div>
      <div class="group"><div class="row between wrap">
        <div><div class="rt">Jumlah kata per ronde</div><div class="rd">Kata yang belum dikuasai lebih sering terpilih.</div></div>
        <div class="seg" id="sizeSeg">${[3, 4, 5].map(n => `<button type="button" data-n="${n}" class="${n === roundSize ? "active" : ""}">${n} kata</button>`).join("")}</div>
      </div></div>
      <div class="actions"><button type="button" class="btn primary big" id="startBtn">Mulai ronde</button></div>`;
    host.querySelectorAll("#sizeSeg button").forEach(b => b.onclick = () => { roundSize = +b.dataset.n; renderStart(host); });
    $("startBtn").onclick = startRound;
  }

  function wordCard(f) {
    return `<div class="group wcard">
      <div class="whead"><span class="wword">${esc(focusOf(f))}</span><span class="wmeta">${esc(focusArti(f))}</span>${f.custom ? '<span class="tagmine">kata saya</span>' : ""}</div>
      <div class="ftable">${f.forms.map(x => `<div class="frow2"><span class="fw">${esc(x.w)}</span>${posPill(x.pos)}<span class="fa">${esc(x.arti)}</span></div>`).join("")}</div>
      ${hasParts(f) ? `<div class="wparts"><span class="plabel">${esc(f.parts.w)}</span><span class="chips">${f.parts.list.map(p => `<span class="chip"><b>${esc(p[0])}</b><small>${esc(p[1] || "")}</small></span>`).join('<span class="plus">+</span>')}</span></div>` : ""}
    </div>`;
  }
  function renderIntro(body) {
    body.innerHTML = round.words.map(wordCard).join("") +
      `<div class="actions"><span class="keys">Perhatikan akhiran tiap bentuk dan jenis katanya.</span><button type="button" class="btn primary" id="introNext">Sudah dibaca, lanjut</button></div>`;
    $("introNext").onclick = advance;
  }

  function renderSummary(stage) {
    const sc = round.steps.filter(s => s.id !== "intro");
    const right = sc.reduce((t, s) => t + s.right, 0), total = sc.reduce((t, s) => t + s.done, 0);
    stage.innerHTML = `
      <div class="group sumhead"><div class="sumbig">${right}<small>/${total}</small></div><div><div class="rt">Ronde selesai</div><div class="rd">${total ? Math.round(100 * right / total) : 0}% jawaban benar</div></div></div>
      <div class="glabel">Per langkah</div>
      <div class="group">${sc.map(s => `<div class="row between"><span>${esc(s.title)}</span><span class="${s.items.length ? "num-r" : "muted"}">${s.items.length ? `${s.right}/${s.done}` : (s.id === "rel" ? "dilewati, belum ada kata yang dikuasai" : "dilewati")}</span></div>`).join("")}</div>
      <div class="glabel">Kata di ronde ini</div>
      <div class="group">${round.words.map(f => `<div class="row between"><span class="fw">${esc(focusOf(f))}</span>${boxes(f)}</div>`).join("")}</div>
      <div class="actions"><button type="button" class="btn" id="sumBack">Selesai</button><button type="button" class="btn primary" id="sumAgain">Ronde baru</button></div>`;
    $("sumBack").onclick = () => { round = null; renderRound(); };
    $("sumAgain").onclick = startRound;
  }

  // =====================================================
  //  LATIHAN BEBAS
  // =====================================================
  const MODES = [["mix", "Campur"], ["pos", "Jenis kata"], ["fill", "Isi kalimat"], ["affix", "Imbuhan"], ["parts", "Pecah kata"], ["rel", "Sinonim/Antonim"]];
  let freeMode = "mix", freeLast = null, freeScore = { r: 0, t: 0 };

  function renderFree() {
    const host = $("view-free");
    host.innerHTML = `
      <h2 class="vtitle">Latihan bebas</h2>
      <p class="vsub">Soal acak tanpa urutan. Cocok untuk pemanasan atau mengulang satu jenis soal saja.</p>
      <div class="toolbar"><div class="seg" id="modeSeg">${MODES.map(([m, l]) => `<button type="button" data-m="${m}" class="${m === freeMode ? "active" : ""}">${l}</button>`).join("")}</div><span class="muted" id="freeScore">Benar ${freeScore.r}/${freeScore.t}</span></div>
      ${freeMode === "rel" ? `<div class="note">Saran: kuasai dulu katanya. Di Campur dan Ronde, sinonim/antonim baru muncul setelah sebuah kata dijawab benar 3 kali, supaya tidak tertukar.</div>` : ""}
      <div id="freeStage"></div>`;
    host.querySelectorAll("#modeSeg button").forEach(b => b.onclick = () => { freeMode = b.dataset.m; freeLast = null; renderFree(); });
    nextFree();
  }
  function nextFree() {
    const list = candidates(freeMode);
    if (!list.length) { $("freeStage").innerHTML = `<div class="group pad muted">Belum ada soal untuk jenis ini.</div>`; return; }
    const cand = pickWeighted(list, freeLast);
    freeLast = cand.key;
    mountQuiz($("freeStage"), cand, {
      onAnswer: ok => { freeScore.t++; if (ok) freeScore.r++; $("freeScore").textContent = `Benar ${freeScore.r}/${freeScore.t}`; },
      onNext: nextFree
    });
  }

  // =====================================================
  //  KATA SAYA (tambah kata langsung dari web)
  // =====================================================
  let editingId = null, wordsMsg = null, wordsTab = "paste", pasteText = "", pastePreview = null, pasteMsg = null;

  const POS_MAP = { n: "noun", noun: "noun", kb: "noun", v: "verb", verb: "verb", kk: "verb", adj: "adjective", adjective: "adjective", ks: "adjective", adv: "adverb", adverb: "adverb", ket: "adverb" };
  const GUESS_SKIP = ["er", "or", "en", "al"]; // akhiran yang terlalu sering menipu
  function guessPos(w) {
    const lw = w.toLowerCase();
    const h = SUFFIX_HINTS.find(h => !GUESS_SKIP.includes(h.end) && lw.endsWith(h.end) && lw.length > h.end.length + 2);
    return h ? h.pos : null;
  }

  const EXAMPLE = [
    "persist (v) = bertahan, tetap melakukan",
    "persistence (n) = kegigihan",
    "persistent (adj) = gigih",
    "pecah: persistent = per- (terus-menerus) + sist (berdiri) + -ent (bersifat)",
    "kalimat: Despite repeated failures, the ___ researcher kept testing new ideas. = persistent",
    "alasan: Sebelum noun (researcher) butuh adjective.",
    "sinonim: determined = bertekad",
    "antonim: hesitant = ragu-ragu",
    "",
    "ubiquitous (adj) = ada di mana-mana",
    "ubiquity (n) = keberadaan di mana-mana",
    "",
    "meticulous = sangat teliti"
  ].join("\n");

  const AI_PROMPT = [
    "Ubah daftar kata bahasa Inggris di bawah ini ke format Vocab Lab. Ikuti aturan ini persis:",
    "",
    "1. Satu kata = satu blok. Pisahkan antarblok dengan satu baris kosong.",
    "2. Di setiap blok, baris pertama adalah kata utama. Tambahkan bentuk lain yang umum dipakai (word family), satu per baris, dengan format:",
    "   kata (jenis) = arti dalam bahasa Indonesia",
    "   Jenis hanya boleh: n, v, adj, adv.",
    "3. Baris tambahan berikut boleh ditulis, boleh dilewati:",
    "   pecah: kata = potongan (arti) + potongan (arti)",
    "   kalimat: kalimat bahasa Inggris dengan ___ di tempat kosong = jawaban",
    "   alasan: alasan singkat dalam bahasa Indonesia kenapa jawabannya itu",
    "   sinonim: kata = arti",
    "   antonim: kata = arti",
    "4. Tulis baris \"pecah\" hanya kalau kata itu benar-benar punya prefix, root, atau suffix yang jelas. Jangan dipaksakan.",
    "5. Jawaban kalimat harus salah satu bentuk kata di blok itu. Buat kalimat bergaya teks akademik seperti soal UTBK Literasi Bahasa Inggris.",
    "6. Jangan tambahkan penomoran, simbol markdown, judul, atau penjelasan lain di luar format.",
    "",
    "Contoh satu blok:",
    EXAMPLE.split("\n\n")[0],
    "",
    "Daftar kata:",
    "[tempel daftar katamu di sini]"
  ].join("\n");

  // ---------- parser teks tempel ----------
  const KEY_RE = /^(pecah|parts?|kalimat|sentence|alasan|why|sinonim|synonyms?|antonim|antonyms?)\s*:\s*(.*)$/i;
  const FORM_RE = /^(.+?)\s*(?:\(([^)]*)\))?\s*[=:–—]\s*(.+)$/;
  const cleanLine = l => l.replace(/\*\*/g, "").replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim();
  function relList(val) {
    const items = val.includes("=") ? val.split(";") : val.split(/[;,]/);
    return items.map(it => {
      const i = it.indexOf("=");
      return i < 0 ? { w: it.trim(), arti: "" } : { w: it.slice(0, i).trim(), arti: it.slice(i + 1).trim() };
    }).filter(x => x.w);
  }
  function parseBulk(text) {
    const blocks = [];
    let cur = [];
    text.replace(/\r/g, "").split("\n").forEach(l => {
      if (/^\s*```/.test(l)) return;
      const c = cleanLine(l);
      if (!c) { if (cur.length) blocks.push(cur); cur = []; }
      else if (!c.startsWith("#")) cur.push(c);
    });
    if (cur.length) blocks.push(cur);
    return blocks.map(parseBlock);
  }
  function parseBlock(lines) {
    const forms = [], errs = [], notes = [];
    let partsRaw = null, sentRaw = null, why = "", synonyms = [], antonyms = [];
    for (const line of lines) {
      const k = line.match(KEY_RE);
      if (k) {
        const key = k[1].toLowerCase(), val = k[2].trim();
        if (key === "pecah" || key.startsWith("part")) {
          let w = "", rest = val;
          if (val.includes("=")) { w = val.slice(0, val.indexOf("=")).trim(); rest = val.slice(val.indexOf("=") + 1); }
          const list = rest.split("+").map(s => {
            const pm = s.trim().match(/^(.+?)\s*(?:\((.*)\))?$/);
            return pm ? [pm[1].trim(), (pm[2] || "").trim()] : null;
          }).filter(p => p && p[0]);
          if (list.length) partsRaw = { w, list }; else errs.push("baris pecah masih kosong");
        } else if (key === "kalimat" || key === "sentence") {
          const i = val.lastIndexOf("=");
          sentRaw = i < 0 ? { text: val, answer: "" } : { text: val.slice(0, i).trim(), answer: val.slice(i + 1).trim() };
          sentRaw.text = sentRaw.text.replace(/_{3,}/, "___");
        } else if (key === "alasan" || key === "why") why = val;
        else if (key === "sinonim" || key.startsWith("synonym")) synonyms = synonyms.concat(relList(val));
        else antonyms = antonyms.concat(relList(val));
        continue;
      }
      const fm = line.match(FORM_RE);
      if (!fm) { errs.push(`baris tidak dikenali: "${line}" (contoh: kata (n) = arti)`); continue; }
      const w = fm[1].trim(), arti = fm[3].trim();
      const posRaw = (fm[2] || "").trim().toLowerCase().replace(/\.$/, "");
      let pos = POS_MAP[posRaw];
      if (posRaw && !pos) { errs.push(`jenis kata "(${fm[2]})" pada "${w}" tidak dikenali, pakai n, v, adj, atau adv`); continue; }
      if (!pos) {
        pos = guessPos(w);
        if (pos) notes.push(`jenis "${w}" ditebak dari akhirannya: ${pos}. Cek lagi, ya.`);
        else { errs.push(`jenis kata "${w}" belum ditulis, contoh: ${w} (n) = ${arti}`); continue; }
      }
      if (forms.some(f => f.w.toLowerCase() === w.toLowerCase())) { errs.push(`"${w}" ditulis dua kali`); continue; }
      forms.push({ w, pos, arti });
    }
    const raw = lines.join("\n");
    if (!forms.length) {
      errs.push("belum ada baris kata, contoh: kata (n) = arti");
      return { title: lines[0], raw, fam: null, errs, notes };
    }
    const find = w => forms.find(f => f.w.toLowerCase() === w.toLowerCase());
    let parts = null;
    if (partsRaw) {
      const target = partsRaw.w ? find(partsRaw.w) : forms[0];
      if (!target) errs.push(`kata "${partsRaw.w}" di baris pecah tidak ada di blok ini`);
      else parts = { w: target.w, list: partsRaw.list };
    }
    let sentence = null;
    if (sentRaw) {
      const ansF = sentRaw.answer ? find(sentRaw.answer) : (forms.length === 1 ? forms[0] : null);
      if (!sentRaw.text.includes("___")) errs.push("kalimat harus memuat ___ (tiga garis bawah)");
      else if (!ansF) errs.push(sentRaw.answer ? `jawaban "${sentRaw.answer}" tidak ada di bentuk kata blok ini` : "kalimat belum punya jawaban, tambahkan = jawaban di akhir");
      else sentence = { text: sentRaw.text, answer: ansF.w, why };
    }
    const main = forms[0].w;
    return {
      title: main, raw, errs, notes,
      fam: errs.length ? null : { id: "u:" + main.toLowerCase(), custom: true, forms, focus: main, parts, sentence, synonyms, antonyms }
    };
  }
  function statusOf(fam) {
    const m = fam.focus.toLowerCase();
    if (FAMILIES.some(f => f.forms.some(x => x.w.toLowerCase() === m))) return "builtin";
    return custom.some(f => f.id === fam.id) ? "update" : "new";
  }
  async function copyText(text, btn) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = ok ? "Tersalin ✓" : "Gagal, salin manual";
    setTimeout(() => { btn.textContent = old; }, 1800);
  }

  // ---------- tampilan utama Kata saya ----------
  function renderWords() {
    const host = $("view-words");
    host.innerHTML = `
      <h2 class="vtitle">Kata saya</h2>
      <p class="vsub">Tambahkan kata dari bacaanmu. Kata langsung ikut di ronde terpandu dan latihan bebas.</p>
      <div class="toolbar"><div class="seg" id="wtab">
        <button type="button" data-t="paste" class="${wordsTab === "paste" ? "active" : ""}">Tempel banyak kata</button>
        <button type="button" data-t="form" class="${wordsTab === "form" ? "active" : ""}">Isi satu per satu</button>
      </div></div>
      <div id="wtabBody"></div>

      <div class="glabel">Daftar kata saya (${custom.length})</div>
      <div class="group">${custom.length ? custom.map(f => `
        <div class="row between">
          <div class="minw"><span class="fw">${esc(focusOf(f))}</span> <span class="muted">· ${f.forms.length} bentuk · ${esc(focusArti(f))}</span></div>
          <div class="btns"><button type="button" class="btn small" data-edit="${esc(f.id)}">Edit</button><button type="button" class="btn small danger" data-del="${esc(f.id)}">Hapus</button></div>
        </div>`).join("") : `<div class="row muted">Belum ada. Kata yang kamu simpan akan muncul di sini.</div>`}</div>

      <div class="glabel">Cadangan & pindah perangkat</div>
      <div class="group"><div class="row between wrap">
        <div><div class="rt">Ekspor / impor</div><div class="rd">Kata hanya tersimpan di browser ini. Ekspor untuk cadangan, lalu impor di HP atau laptop lain.</div></div>
        <div class="btns"><button type="button" class="btn" id="expBtn">Ekspor</button><button type="button" class="btn" id="impBtn">Impor</button><input type="file" id="impFile" accept=".json,application/json" hidden></div>
      </div><div class="row muted small" id="ioMsg" hidden></div></div>`;

    host.querySelectorAll("#wtab button").forEach(b => b.onclick = () => { wordsTab = b.dataset.t; if (wordsTab === "paste") editingId = null; renderWords(); });
    host.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => { editingId = b.dataset.edit; wordsTab = "form"; renderWords(); window.scrollTo(0, 0); });
    host.querySelectorAll("[data-del]").forEach(b => b.onclick = () => deleteWord(b.dataset.del));
    $("expBtn").onclick = exportWords;
    $("impBtn").onclick = () => $("impFile").click();
    $("impFile").onchange = importWords;

    if (wordsTab === "paste") renderPaste($("wtabBody"));
    else renderForm($("wtabBody"));
  }

  // ---------- tab: tempel banyak ----------
  function renderPaste(body) {
    body.innerHTML = `
      <div class="group form">
        <div class="fsec">
          <div class="fhead"><b>Tempel daftar kata</b><span>Satu kata per blok, pisahkan dengan baris kosong. Formatnya ada di bawah.</span></div>
          <textarea id="pasteBox" rows="12" spellcheck="false" autocapitalize="off" placeholder="${esc(EXAMPLE)}"></textarea>
          <div class="actions"><button type="button" class="btn small" id="pasteEx">Isi contoh</button><button type="button" class="btn small" id="pasteClear">Kosongkan</button><span class="grow"></span><button type="button" class="btn primary" id="pasteCheck">Periksa</button></div>
        </div>
        <div id="pastePrev"></div>
      </div>

      <div class="glabel">Format</div>
      <div class="group">
        <div class="row col"><code class="fmt">kata (jenis) = arti</code><span class="rd"><b>Wajib</b>, minimal 1 baris per blok. Jenis: <b>n</b>, <b>v</b>, <b>adj</b>, <b>adv</b>. Kalau tidak ditulis, sistem menebak dari akhiran (-tion, -ous, -ly, dll.).</span></div>
        <div class="row col"><code class="fmt">pecah: kata = potongan (arti) + potongan (arti)</code><span class="rd">Opsional. Hanya untuk kata yang punya imbuhan jelas.</span></div>
        <div class="row col"><code class="fmt">kalimat: kalimat dengan ___ = jawaban</code><span class="rd">Opsional. Jawaban harus salah satu bentuk kata di blok itu.</span></div>
        <div class="row col"><code class="fmt">alasan: penjelasan singkat</code><span class="rd">Opsional. Muncul setelah menjawab soal kalimat.</span></div>
        <div class="row col"><code class="fmt">sinonim: kata = arti</code><span class="rd">Opsional. Lebih dari satu? Pisahkan dengan titik koma (;).</span></div>
        <div class="row col"><code class="fmt">antonim: kata = arti</code><span class="rd">Opsional.</span></div>
      </div>

      <div class="glabel">Instruksi untuk AI</div>
      <div class="group">
        <div class="row between wrap">
          <div><div class="rt">Biar AI yang menyusun formatnya</div><div class="rd">Salin instruksi ini, tempel ke ChatGPT atau Claude bersama daftar katamu, lalu tempel hasilnya ke kotak di atas dan klik Periksa.</div></div>
          <button type="button" class="btn" id="copyPrompt">Salin instruksi</button>
        </div>
        <details class="det"><summary>Lihat isi instruksi</summary><pre class="pre">${esc(AI_PROMPT)}</pre></details>
      </div>`;

    const box = $("pasteBox");
    box.value = pasteText;
    box.oninput = () => { pasteText = box.value; if (pastePreview) { pastePreview = null; renderPreview(); } };
    $("pasteEx").onclick = () => { pasteText = box.value = EXAMPLE; pastePreview = null; renderPreview(); };
    $("pasteClear").onclick = () => { pasteText = box.value = ""; pastePreview = null; renderPreview(); };
    $("pasteCheck").onclick = () => {
      pasteMsg = null;
      pastePreview = pasteText.trim() ? parseBulk(pasteText) : [];
      renderPreview();
      $("pastePrev").scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    $("copyPrompt").onclick = e => copyText(AI_PROMPT, e.currentTarget);
    renderPreview();
  }

  function renderPreview() {
    const box = $("pastePrev");
    if (!box) return;
    if (!pastePreview) {
      box.innerHTML = pasteMsg ? `<div class="fsec"><span class="fmsg ok">${esc(pasteMsg)}</span></div>` : "";
      return;
    }
    if (!pastePreview.length) { box.innerHTML = `<div class="fsec"><span class="fmsg no">Kotaknya masih kosong.</span></div>`; return; }
    const res = pastePreview;
    const ready = res.filter(r => r.fam && statusOf(r.fam) !== "builtin");
    const bad = res.filter(r => !r.fam).length;
    const LBL = { new: "baru", update: "perbarui", builtin: "sudah ada (bawaan)", error: "perlu diperbaiki" };
    box.innerHTML = `
      <div class="fsec">
        <div class="fhead"><b>Hasil pemeriksaan</b><span>${res.length} blok · ${ready.length} siap disimpan${bad ? ` · ${bad} perlu diperbaiki` : ""}</span></div>
        <div class="plist">${res.map(r => {
          const st = r.fam ? statusOf(r.fam) : "error";
          const info = r.fam ? [`${r.fam.forms.length} bentuk`, r.fam.parts && "pecah", r.fam.sentence && "kalimat", r.fam.synonyms.length && "sinonim", r.fam.antonyms.length && "antonim"].filter(Boolean).join(" · ") : "";
          return `<div class="pitem st-${st}">
            <div class="phead"><span class="fw">${esc(r.title)}</span><span class="stl">${LBL[st]}</span></div>
            ${info ? `<div class="rd">${esc(info)}</div>` : ""}
            ${r.errs.map(e => `<div class="perr">${esc(e)}</div>`).join("")}
            ${r.notes.map(n => `<div class="pnote">${esc(n)}</div>`).join("")}
          </div>`;
        }).join("")}</div>
      </div>
      <div class="fsec factions">
        <span class="fmsg">${bad ? "Blok merah tidak ikut disimpan dan tetap di kotak supaya bisa diperbaiki." : ""}</span>
        <button type="button" class="btn primary" id="pasteSave"${ready.length ? "" : " disabled"}>Simpan ${ready.length} kata</button>
      </div>`;
    $("pasteSave").onclick = () => {
      const before = custom.slice();
      ready.forEach(r => {
        const i = custom.findIndex(f => f.id === r.fam.id);
        if (i >= 0) custom[i] = r.fam; else custom.push(r.fam);
      });
      if (!saveCustom()) { custom = before; pasteMsg = "Gagal menyimpan: penyimpanan browser tidak tersedia."; pastePreview = null; renderPreview(); return; }
      pasteText = res.filter(r => !r.fam).map(r => r.raw).join("\n\n");
      pastePreview = null;
      pasteMsg = `${ready.length} kata tersimpan dan langsung ikut latihan.${bad ? ` ${bad} blok yang perlu diperbaiki masih di kotak.` : ""}`;
      updateBadge();
      renderWords();
    };
  }

  // ---------- tab: isi satu per satu ----------
  function renderForm(body) {
    const f = editingId ? custom.find(x => x.id === editingId) : null;
    if (editingId && !f) editingId = null;
    body.innerHTML = `
      <form class="group form" id="wordForm" novalidate>
        <div class="fsec">
          <div class="fhead"><b>${editingId ? "Edit kata" : "Bentuk kata"}</b><span>Wajib minimal 1. Baris pertama jadi kata utama. Tambah bentuk lain kalau ada.</span></div>
          <div class="frow fhdr"><span>Kata</span><span>Jenis</span><span>Arti</span><span></span></div>
          <div id="formsBox"></div>
          <button type="button" class="btn small" id="addForm">+ Tambah bentuk</button>
        </div>
        <details class="fsec det"${f && (f.parts || f.sentence || syns(f).length || ants(f).length) ? " open" : ""}>
          <summary><b>Tambahan (opsional)</b><span>Pecah kata, kalimat rumpang, sinonim & antonim</span></summary>
          <div class="subsec">
            <div class="fhead"><b>Pecah kata</b><span>Lewati kalau katanya tidak punya imbuhan yang jelas.</span></div>
            <label class="fl">Kata yang dipecah<select id="partsWord"></select></label>
            <div id="partsBox"></div>
            <button type="button" class="btn small" id="addPart">+ Tambah potongan</button>
          </div>
          <div class="subsec">
            <div class="fhead"><b>Kalimat rumpang</b><span>Tulis ___ (tiga garis bawah) di tempat kosong.</span></div>
            <label class="fl">Kalimat<textarea id="sText" rows="2"></textarea></label>
            <div class="grid2"><label class="fl">Jawaban<select id="sAns"></select></label><label class="fl">Alasan<input id="sWhy"></label></div>
          </div>
          <div class="subsec">
            <div class="fhead"><b>Sinonim & antonim</b><span>Padanan dan lawan dari kata utama.</span></div>
            <div class="grid2"><label class="fl">Sinonim<input id="synW" autocapitalize="off" spellcheck="false"></label><label class="fl">Arti sinonim<input id="synA"></label></div>
            <div class="grid2"><label class="fl">Antonim<input id="antW" autocapitalize="off" spellcheck="false"></label><label class="fl">Arti antonim<input id="antA"></label></div>
          </div>
        </details>
        <div class="fsec factions">
          <span id="formMsg" class="fmsg"></span>
          ${editingId ? '<button type="button" class="btn" id="cancelEdit">Batal</button>' : ""}
          <button type="submit" class="btn primary">${editingId ? "Simpan perubahan" : "Simpan kata"}</button>
        </div>
      </form>`;

    fillForm(f);
    $("formsBox").addEventListener("input", e => { if (e.target.classList.contains("f-w")) refreshSelects(); });
    $("addForm").onclick = () => { $("formsBox").appendChild(formRow()); };
    $("addPart").onclick = () => { $("partsBox").appendChild(partRow()); };
    $("wordForm").onsubmit = e => { e.preventDefault(); saveWord(); };
    if ($("cancelEdit")) $("cancelEdit").onclick = () => { editingId = null; renderWords(); };
    if (wordsMsg) { setMsg(wordsMsg.text, wordsMsg.ok); wordsMsg = null; }
  }

  function setMsg(text, ok) { const m = $("formMsg"); m.textContent = text; m.className = "fmsg " + (ok ? "ok" : "no"); }
  function ioMsg(text) { const m = $("ioMsg"); m.textContent = text; m.hidden = false; }

  function formRow(v) {
    v = v || {};
    const d = document.createElement("div");
    d.className = "frow";
    d.innerHTML = `<input class="f-w" placeholder="kata" value="${esc(v.w || "")}" autocapitalize="off" autocomplete="off" spellcheck="false">` +
      `<select class="f-pos">${POS.map(p => `<option value="${p}"${p === (v.pos || "noun") ? " selected" : ""}>${p}</option>`).join("")}</select>` +
      `<input class="f-arti" placeholder="arti" value="${esc(v.arti || "")}">` +
      `<button type="button" class="xbtn" title="Hapus baris" aria-label="Hapus baris">−</button>`;
    d.querySelector(".f-w").addEventListener("change", e => {
      const g = guessPos(e.target.value.trim());
      if (g && !v.pos) d.querySelector(".f-pos").value = g; // tebak jenis kata dari akhiran
    });
    d.querySelector(".xbtn").onclick = () => { if ($("formsBox").children.length > 1) { d.remove(); refreshSelects(); } };
    return d;
  }
  function partRow(v) {
    v = v || ["", ""];
    const d = document.createElement("div");
    d.className = "prow";
    d.innerHTML = `<input class="p-b" placeholder="potongan" value="${esc(v[0])}" autocapitalize="off" spellcheck="false">` +
      `<input class="p-a" placeholder="arti potongan" value="${esc(v[1])}">` +
      `<button type="button" class="xbtn" title="Hapus baris" aria-label="Hapus baris">−</button>`;
    d.querySelector(".xbtn").onclick = () => d.remove();
    return d;
  }
  function refreshSelects() {
    const words = [...document.querySelectorAll("#formsBox .f-w")].map(i => i.value.trim()).filter(Boolean);
    ["partsWord", "sAns"].forEach(id => {
      const s = $(id), cur = s.value || s.dataset.want || "";
      s.innerHTML = `<option value="">— pilih —</option>` + words.map(w => `<option value="${esc(w)}"${w === cur ? " selected" : ""}>${esc(w)}</option>`).join("");
      delete s.dataset.want;
    });
  }
  function fillForm(f) {
    const fb = $("formsBox"); fb.innerHTML = "";
    (f ? f.forms : [{}]).forEach(x => fb.appendChild(formRow(x)));
    const pb = $("partsBox"); pb.innerHTML = "";
    (f && f.parts ? f.parts.list : []).forEach(p => pb.appendChild(partRow(p)));
    $("partsWord").dataset.want = f && f.parts ? f.parts.w : "";
    $("sText").value = f && f.sentence ? f.sentence.text : "";
    $("sAns").dataset.want = f && f.sentence ? f.sentence.answer : "";
    $("sWhy").value = f && f.sentence ? f.sentence.why || "" : "";
    const s0 = f && syns(f)[0], a0 = f && ants(f)[0];
    $("synW").value = s0 ? s0.w : ""; $("synA").value = s0 ? s0.arti : "";
    $("antW").value = a0 ? a0.w : ""; $("antA").value = a0 ? a0.arti : "";
    refreshSelects();
  }

  function readForm() {
    const rows = [...document.querySelectorAll("#formsBox .frow")].map(r => ({
      w: r.querySelector(".f-w").value.trim(), pos: r.querySelector(".f-pos").value, arti: r.querySelector(".f-arti").value.trim()
    }));
    const used = rows.filter(r => r.w || r.arti);
    if (used.some(r => !r.w || !r.arti)) return { err: "Setiap bentuk kata harus diisi kata dan artinya." };
    if (!used.length) return { err: "Isi minimal 1 kata." };
    const lower = used.map(r => r.w.toLowerCase());
    if (new Set(lower).size !== lower.length) return { err: "Ada bentuk kata yang ditulis dua kali." };
    const main = used[0].w;
    const id = editingId || "u:" + main.toLowerCase();
    if (!editingId && fams().some(f => f.id === id || f.forms.some(x => x.w.toLowerCase() === main.toLowerCase()))) {
      return { err: `"${main}" sudah ada di daftar kata.` };
    }

    const prow = [...document.querySelectorAll("#partsBox .prow")]
      .map(r => [r.querySelector(".p-b").value.trim(), r.querySelector(".p-a").value.trim()])
      .filter(p => p[0] || p[1]);
    let parts = null;
    if (prow.length) {
      if (prow.some(p => !p[0])) return { err: "Kolom potongan tidak boleh kosong (artinya boleh)." };
      const pw = $("partsWord").value || (used.length === 1 ? main : "");
      if (!pw) return { err: "Pilih kata yang dipecah." };
      parts = { w: pw, list: prow };
    }

    let sentence = null;
    const st = $("sText").value.trim().replace(/_{3,}/, "___");
    if (st) {
      if (!st.includes("___")) return { err: "Kalimat harus memuat ___ (tiga garis bawah) sebagai tempat kosong." };
      const ans = $("sAns").value || (used.length === 1 ? main : "");
      if (!ans) return { err: "Pilih jawaban untuk kalimat rumpang." };
      sentence = { text: st, answer: ans, why: $("sWhy").value.trim() };
    }

    const synW = $("synW").value.trim(), synA = $("synA").value.trim();
    const antW = $("antW").value.trim(), antA = $("antA").value.trim();
    return {
      fam: {
        id, custom: true, forms: used, focus: main, parts, sentence,
        synonyms: synW ? [{ w: synW, arti: synA }] : [],
        antonyms: antW ? [{ w: antW, arti: antA }] : []
      }
    };
  }

  function saveWord() {
    const r = readForm();
    if (r.err) return setMsg(r.err, false);
    const before = custom.slice();
    if (editingId) custom = custom.map(f => f.id === editingId ? r.fam : f);
    else custom.push(r.fam);
    if (!saveCustom()) { custom = before; return setMsg("Gagal menyimpan: penyimpanan browser tidak tersedia.", false); }
    wordsMsg = { text: `"${r.fam.focus}" tersimpan dan langsung ikut latihan.`, ok: true };
    editingId = null;
    updateBadge();
    renderWords();
  }

  function deleteWord(id) {
    const f = custom.find(x => x.id === id);
    if (!f || !confirm(`Hapus "${focusOf(f)}" dari kata saya?`)) return;
    custom = custom.filter(x => x.id !== id);
    saveCustom();
    if (editingId === id) editingId = null;
    updateBadge();
    renderWords();
  }

  function exportWords() {
    if (!custom.length) return ioMsg("Belum ada kata untuk diekspor.");
    const blob = new Blob([JSON.stringify({ app: "vocab-lab", version: 1, words: custom }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vocab-lab-kata-saya.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    ioMsg(`${custom.length} kata diekspor ke vocab-lab-kata-saya.json.`);
  }

  function normalize(f) {
    if (!f || !Array.isArray(f.forms)) return null;
    const forms = f.forms
      .filter(x => x && x.w && x.arti && POS.includes(x.pos))
      .map(x => ({ w: String(x.w).trim(), pos: x.pos, arti: String(x.arti).trim() }));
    if (!forms.length) return null;
    const n = { id: "u:" + forms[0].w.toLowerCase(), custom: true, forms, focus: forms[0].w, parts: null, sentence: null, synonyms: [], antonyms: [] };
    if (f.parts && Array.isArray(f.parts.list) && forms.some(x => x.w === f.parts.w)) {
      const list = f.parts.list.filter(p => Array.isArray(p) && p[0]).map(p => [String(p[0]), String(p[1] || "")]);
      if (list.length) n.parts = { w: f.parts.w, list };
    }
    if (f.sentence && typeof f.sentence.text === "string" && f.sentence.text.includes("___") && forms.some(x => x.w === f.sentence.answer)) {
      n.sentence = { text: f.sentence.text, answer: f.sentence.answer, why: String(f.sentence.why || "") };
    }
    const rel = a => Array.isArray(a) ? a.filter(x => x && x.w).map(x => ({ w: String(x.w), arti: String(x.arti || "") })) : [];
    n.synonyms = rel(f.synonyms);
    n.antonyms = rel(f.antonyms);
    return n;
  }

  function importWords(e) {
    const file = e.target.files[0];
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      let list;
      try { const data = JSON.parse(rd.result); list = Array.isArray(data) ? data : data.words; } catch (err) { list = null; }
      if (!Array.isArray(list)) return ioMsg("File tidak bisa dibaca. Pastikan ini file hasil Ekspor Vocab Lab.");
      let added = 0, updated = 0, skipped = 0;
      list.forEach(raw => {
        const n = normalize(raw);
        if (!n) { skipped++; return; }
        if (statusOf(n) === "builtin") { skipped++; return; }
        const i = custom.findIndex(f => f.id === n.id);
        if (i >= 0) { custom[i] = n; updated++; } else { custom.push(n); added++; }
      });
      saveCustom();
      updateBadge();
      renderWords();
      ioMsg(`Impor selesai: ${added} kata baru, ${updated} diperbarui${skipped ? `, ${skipped} dilewati` : ""}.`);
    };
    rd.readAsText(file);
  }

  // =====================================================
  //  PROGRES
  // =====================================================
  function renderProgress() {
    const host = $("view-progress");
    const F = fams(), N = F.length, mastered = F.filter(isMastered).length;
    const pts = F.reduce((t, f) => t + Math.min(famCorrect(f.id), MASTER), 0);
    const pct = N ? Math.round(100 * pts / (N * MASTER)) : 0;
    let right = 0, wrong = 0;
    for (const k in stats) { right += stats[k].c; wrong += stats[k].w; }
    host.innerHTML = `
      <h2 class="vtitle">Progres</h2>
      <p class="vsub">Satu kata dianggap dikuasai setelah 3 jawaban benar di soal kata itu (pecah kata, jenis kata, isi kalimat, sinonim/antonim). Soal imbuhan dicatat terpisah.</p>
      <div class="stats3">
        <div class="group stat"><div class="sv">${mastered}<small>/${N}</small></div><div class="sl">kata dikuasai</div></div>
        <div class="group stat"><div class="sv">${pct}<small>%</small></div><div class="sl">menuju semua dikuasai</div></div>
        <div class="group stat"><div class="sv">${right}<small>/${right + wrong}</small></div><div class="sl">total jawaban benar</div></div>
      </div>
      <div class="group pad"><div class="pbar"><span style="width:${pct}%"></span></div></div>
      <div class="glabel">Per kata · ■ = 1 jawaban benar</div>
      <div class="group wgrid">${F.map(f => `<div class="wcell ${isMastered(f) ? "done" : ""}"><span class="fw">${esc(focusOf(f))}${f.custom ? ' <span class="tagmine">saya</span>' : ""}</span>${boxes(f)}</div>`).join("")}</div>
      <div class="actions"><button type="button" class="btn danger" id="resetBtn">Reset progres</button></div>`;
    $("resetBtn").onclick = () => {
      if (!confirm("Hapus semua progres? Kata saya tidak ikut terhapus.")) return;
      stats = {}; saveStats(); updateBadge(); renderProgress();
    };
  }

  // =====================================================
  //  NAVIGASI
  // =====================================================
  const VIEWS = ["round", "free", "words", "progress"];
  function updateBadge() {
    const F = fams();
    $("badge").textContent = `${F.filter(isMastered).length}/${F.length} kata dikuasai`;
  }
  function show(v) {
    activeQuiz = null;
    VIEWS.forEach(id => { $("view-" + id).hidden = id !== v; });
    document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === v));
    if (v === "round") renderRound();
    if (v === "free") renderFree();
    if (v === "words") renderWords();
    if (v === "progress") renderProgress();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll("[data-view]").forEach(b => b.onclick = () => show(b.dataset.view));

  updateBadge();
  show("round");
})();
