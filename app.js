(function () {
  "use strict";

  // ---------- Penyimpanan progres (localStorage) ----------
  const STORE = "vocabLab.stats.v1";
  const MASTER = 3; // jumlah jawaban benar per keluarga kata sebelum sinonim/antonim dibuka
  let stats = load();
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(stats)); } catch (e) {} }

  // ---------- Utilitas ----------
  const POS_ID = { noun: "kata benda", verb: "kata kerja", adjective: "kata sifat", adverb: "kata keterangan" };
  const rand = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ALL_FORMS = FAMILIES.flatMap(f => f.forms.map(x => ({ ...x, fam: f.id })));
  const SUFFIX_HINTS = AFFIXES.suffix
    .flatMap(s => s.form.split("/").map(t => ({ end: t.trim().replace(/^-/, ""), pos: s.pos })))
    .sort((a, b) => b.end.length - a.end.length);

  function suffixHint(w, pos) {
    const h = SUFFIX_HINTS.find(h => w.endsWith(h.end));
    return h && h.pos === pos ? `akhiran <b>-${esc(h.end)}</b> biasanya membentuk ${h.pos}` : "";
  }
  function famCorrect(id) { let c = 0; for (const k in stats) if (stats[k].fam === id) c += stats[k].c; return c; }
  const isMastered = f => famCorrect(f.id) >= MASTER;
  const focusArti = f => (f.forms.find(x => x.w === f.focus) || {}).arti || "";

  // ---------- Pembuat soal ----------
  function qPos(form) {
    const others = ALL_FORMS.filter(f => f.pos !== form.pos);
    const pool = shuffle(others.filter(f => f.fam === form.fam)).concat(shuffle(others.filter(f => f.fam !== form.fam)));
    const picks = [];
    for (const f of pool) { if (picks.length >= 3) break; if (!picks.some(p => p.w === f.w)) picks.push(f); }
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
    return {
      tag: "Isi kalimat",
      prompt: esc(s.text).replace("___", '<span class="blank">_____</span>'),
      sub: "Pilih bentuk kata yang tepat.",
      options: shuffle(fam.forms).map(f => ({ label: f.w, correct: f.w === s.answer })),
      explain: `${esc(s.why)} Jawaban: <b>${esc(ans.w)}</b> (${ans.pos}, ${esc(ans.arti)}).` +
        `<ul>${fam.forms.filter(f => f.w !== ans.w).map(f => `<li>${esc(f.w)} = ${f.pos}</li>`).join("")}</ul>`
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
        options: shuffle(["noun", "verb", "adjective", "adverb"]).map(p => ({ label: p, correct: p === item.pos })),
        explain: `<b>${esc(item.form)}</b> → ${item.pos} (${POS_ID[item.pos]}), artinya kira-kira "${esc(item.meaning)}". ${exLine}`
      };
    }
    const others = shuffle(AFFIXES[kind].filter(a => a.meaning !== item.meaning));
    const picks = [];
    for (const o of others) { if (picks.length >= 3) break; if (!picks.includes(o.meaning)) picks.push(o.meaning); }
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
    for (const o of shuffle(ALL_FORMS.filter(f => f.fam !== fam.id))) {
      if (picks.length >= 3) break;
      if (o.arti !== form.arti && !picks.includes(o.arti)) picks.push(o.arti);
    }
    return {
      tag: "Pecah kata",
      prompt: `<span class="chips">${p.list.map(x => `<span class="chip">${esc(x[0])}</span>`).join('<span class="plus">+</span>')}</span>`,
      sub: `Dari bagian-bagiannya, apa arti <b>${esc(p.w)}</b>?`,
      options: shuffle([form.arti, ...picks]).map(a => ({ label: a, correct: a === form.arti })),
      explain: `<ul>${p.list.map(x => `<li><b>${esc(x[0])}</b> = ${esc(x[1])}</li>`).join("")}</ul>` +
        `Jadi <b>${esc(p.w)}</b> (${form.pos}) = ${esc(form.arti)}.`
    };
  }

  function qRel(fam, kind) {
    const list = kind === "syn" ? fam.synonyms : fam.antonyms;
    const ans = rand(list);
    const exclude = new Set([...fam.synonyms, ...fam.antonyms].map(x => x.w).concat(fam.forms.map(f => f.w)));
    const pool = shuffle(FAMILIES.filter(f => f.id !== fam.id && !exclude.has(f.focus)));
    const picks = pool.slice(0, 3).map(f => ({ w: f.focus, arti: focusArti(f) }));
    const label = kind === "syn" ? "Sinonim" : "Antonim";
    return {
      tag: label,
      prompt: `${label} dari <b>${esc(fam.focus)}</b>?`,
      sub: `${esc(fam.focus)} = ${esc(focusArti(fam))}. Pilih kata yang artinya ${kind === "syn" ? "paling mirip" : "berlawanan"}.`,
      options: shuffle([ans, ...picks]).map(o => ({ label: o.w, correct: o.w === ans.w })),
      explain: `<b>${esc(fam.focus)}</b> (${esc(focusArti(fam))}) ${kind === "syn" ? "≈" : "↔"} <b>${esc(ans.w)}</b> (${esc(ans.arti)}).` +
        `<ul>${picks.map(o => `<li>${esc(o.w)} = ${esc(o.arti)}</li>`).join("")}</ul>`
    };
  }

  // ---------- Daftar kandidat soal per mode ----------
  function candidates(mode) {
    const c = [];
    const want = m => mode === "mix" || mode === m;
    if (want("pos")) ALL_FORMS.forEach(f => c.push({ key: "pos:" + f.w, fam: f.fam, make: () => qPos(f) }));
    if (want("fill")) FAMILIES.forEach(f => f.sentence && c.push({ key: "fill:" + f.id, fam: f.id, make: () => qFill(f) }));
    if (want("affix")) ["prefix", "root", "suffix"].forEach(k => AFFIXES[k].forEach(a => c.push({ key: "affix:" + a.form, fam: null, make: () => qAffix(k, a) })));
    if (want("parts")) FAMILIES.forEach(f => f.parts && c.push({ key: "parts:" + f.id, fam: f.id, make: () => qParts(f) }));
    if (want("rel")) FAMILIES.forEach(f => {
      if (mode === "mix" && !isMastered(f)) return; // di mode campur, sinonim/antonim baru keluar setelah kata dikuasai
      if (f.synonyms.length) c.push({ key: "syn:" + f.id, fam: f.id, make: () => qRel(f, "syn") });
      if (f.antonyms.length) c.push({ key: "ant:" + f.id, fam: f.id, make: () => qRel(f, "ant") });
    });
    return c;
  }

  // Soal yang sering salah muncul lebih sering
  function weight(key) {
    const s = stats[key];
    if (!s) return 1.5;
    return Math.max(0.2, 1 + 2 * s.w - 0.25 * Math.min(s.c, 4));
  }
  function pick(list) {
    if (list.length > 1) list = list.filter(x => x.key !== lastKey);
    const total = list.reduce((t, x) => t + weight(x.key), 0);
    let r = Math.random() * total;
    for (const x of list) { r -= weight(x.key); if (r <= 0) return x; }
    return list[list.length - 1];
  }

  // ---------- Tampilan ----------
  const $ = id => document.getElementById(id);
  let mode = "mix", lastKey = null, current = null, answered = false;
  let session = { right: 0, total: 0 };

  function next() {
    const cand = pick(candidates(mode));
    lastKey = cand.key;
    current = { ...cand, q: cand.make() };
    answered = false;
    const q = current.q;
    $("tag").textContent = q.tag;
    $("prompt").innerHTML = q.prompt;
    $("sub").innerHTML = q.sub;
    $("feedback").hidden = true;
    $("nextBtn").hidden = true;
    const box = $("options");
    box.innerHTML = "";
    q.options.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = `<span class="num">${i + 1}</span><span>${esc(o.label)}</span>`;
      b.onclick = () => answer(i);
      box.appendChild(b);
    });
    $("relNote").hidden = mode !== "rel" || FAMILIES.every(isMastered);
  }

  function answer(i) {
    if (answered) return;
    answered = true;
    const q = current.q;
    const ok = q.options[i].correct;
    const s = stats[current.key] || { c: 0, w: 0, fam: current.fam };
    ok ? s.c++ : s.w++;
    stats[current.key] = s;
    save();
    session.total++; if (ok) session.right++;
    [...$("options").children].forEach((b, j) => {
      b.disabled = true;
      if (q.options[j].correct) b.classList.add("correct");
      else if (j === i) b.classList.add("wrong");
    });
    const fb = $("feedback");
    fb.className = "feedback " + (ok ? "ok" : "no");
    fb.innerHTML = `<div class="verdict">${ok ? "Benar!" : "Belum tepat"}</div>${q.explain}`;
    fb.hidden = false;
    $("nextBtn").hidden = false;
    $("nextBtn").focus();
    renderStats();
  }

  function renderStats() {
    const mastered = FAMILIES.filter(isMastered).length;
    $("score").textContent = `Sesi ini: ${session.right}/${session.total}`;
    $("mastery").textContent = `Kata dikuasai: ${mastered}/${FAMILIES.length}`;
    $("bar").style.width = (100 * mastered / FAMILIES.length) + "%";
  }

  document.querySelectorAll(".mode").forEach(b => b.onclick = () => {
    document.querySelectorAll(".mode").forEach(x => x.classList.toggle("active", x === b));
    mode = b.dataset.mode;
    lastKey = null;
    next();
  });
  $("nextBtn").onclick = next;
  $("resetBtn").onclick = () => {
    if (!confirm("Hapus semua progres?")) return;
    stats = {}; save(); session = { right: 0, total: 0 }; renderStats(); next();
  };
  // Keyboard: angka 1–4 untuk menjawab, Enter untuk soal berikutnya
  document.addEventListener("keydown", e => {
    if (!answered && /^[1-4]$/.test(e.key)) {
      const i = +e.key - 1;
      if (current && i < current.q.options.length) answer(i);
    } else if (answered && e.key === "Enter") { e.preventDefault(); next(); }
  });

  renderStats();
  next();
})();
