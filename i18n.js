// =====================================================
//  BAHASA TAMPILAN (ID / EN)
//  Teks antarmuka diterjemahkan otomatis saat bahasa = EN.
//  Data kata (arti, kalimat, alasan) tidak ikut diterjemahkan.
// =====================================================
(function () {
  "use strict";
  const KEY = "vocabLab.settings.v1";
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { settings = {}; }
  const lang = settings.lang === "en" ? "en" : "id";
  window.VL_LANG = lang;

  // ---------- teks persis ----------
  const EXACT = {
    // navigasi & umum
    "Ronde terpandu": "Guided round", "Latihan bebas": "Free practice", "Kata saya": "My words", "Progres": "Progress",
    "Bahasa": "Language", "Belum ada kata": "No words yet", "Sumber kata": "Word source",
    "Benar": "Correct", "Belum tepat": "Not quite", "Jadi": "So",
    "Soal berikutnya": "Next question", "Lihat hasil": "See results", "Akhiri": "End",
    "1–4 jawab · Enter lanjut": "1–4 answer · Enter next",
    "Hapus": "Delete", "Edit": "Edit", "Batal": "Cancel", "Selesai": "Done",
    // tahap & jenis soal
    "Kenalan": "Meet the words", "Imbuhan": "Affixes", "Pecah kata": "Word parts", "Jenis kata": "Word type",
    "Isi kalimat": "Fill the blank", "Sinonim & antonim": "Synonyms & antonyms", "Sinonim/Antonim": "Synonym/Antonym",
    "Sinonim": "Synonym", "Antonim": "Antonym", "Campur": "Mixed",
    "Baca keluarga kata: semua bentuknya, jenis katanya, arti, dan potongan katanya. Belum ada soal.": "Read each word family: all its forms, word types, meanings, and parts. No questions yet.",
    "Tebak arti prefix, root, dan suffix yang dipakai kata-kata ini.": "Guess the meaning of the prefixes, roots, and suffixes used in these words.",
    "Dari potongan-potongannya, tebak arti kata utuhnya.": "Guess the whole word's meaning from its parts.",
    "Bedakan noun, verb, adjective, dan adverb dari bentuknya.": "Tell nouns, verbs, adjectives, and adverbs apart by their form.",
    "Pilih bentuk kata yang pas di dalam kalimat.": "Choose the word form that fits the sentence.",
    "Pilih padanan atau lawan kata dari kata-kata di ronde ini, ditambah ulangan kata yang sudah dikuasai.": "Pick synonyms or antonyms for the words in this round, plus a review of words you've mastered.",
    // soal
    "Mana yang kata benda?": "Pick the noun.", "Mana yang kata kerja?": "Pick the verb.",
    "Mana yang kata sifat?": "Pick the adjective.", "Mana yang kata keterangan?": "Pick the adverb.",
    "Pilih bentuk kata yang tepat.": "Choose the correct word form.",
    "Akhiran": "The suffix", "biasanya membentuk kata jenis apa?": "usually forms which word type?",
    "Apa arti": "What is the meaning of",
    "Prefix (awalan)": "Prefix", "Root (akar kata)": "Root", "Suffix (akhiran)": "Suffix",
    "Dari potongan-potongannya, apa arti": "From its parts, what is the meaning of",
    "Sinonim dari": "Synonym of", "Antonim dari": "Antonym of",
    "Pilih kata yang artinya paling mirip.": "Choose the word with the closest meaning.",
    "Pilih kata yang artinya berlawanan.": "Choose the word with the opposite meaning.",
    // ronde
    "Satu ronde melatih kata pilihanmu lewat 6 langkah berurutan, dari mengenali bentuknya sampai memakainya di kalimat.": "A round trains the words you choose through 6 ordered steps, from recognizing their forms to using them in sentences.",
    "Satu ronde melatih kata pilihanmu lewat 6 langkah berurutan.": "A round trains the words you choose through 6 ordered steps.",
    "Kata untuk ronde ini": "Words for this round", "Pilih sendiri": "Choose myself", "Acak": "Random",
    "Pilih semua": "Select all", "Kosongkan": "Clear", "Jumlah kata": "Number of words",
    "Mulai ronde": "Start round", "Pilih kata dulu": "Choose words first",
    "Lihat urutan 6 langkah": "See the 6 steps",
    "Ronde panjang: tahap Kenalan akan berisi banyak kata.": "Long round: the Meet the words step will have many words.",
    "Perhatikan akhiran tiap bentuk dan jenis katanya.": "Notice each form's suffix and word type.",
    "Sudah dibaca, lanjut": "Done reading, continue",
    "Ronde selesai": "Round complete", "Per langkah": "Per step", "Kata di ronde ini": "Words in this round",
    "dilewati": "skipped", "dilewati, kata di ronde ini belum punya sinonim/antonim": "skipped, the words in this round have no synonyms/antonyms yet",
    "Ronde baru": "New round",
    // sumber kata & kosong
    "Belum ada kata saya": "No words of your own yet",
    "Tambah kata": "Add words", "Pakai kata contoh": "Use example words",
    // latihan bebas
    "Soal acak tanpa urutan. Cocok untuk pemanasan atau mengulang satu jenis soal saja.": "Random questions in no particular order. Good for warming up or drilling one question type.",
    "Saran: kenali dulu katanya lewat jenis soal lain. Di tab Campur, sinonim/antonim baru muncul setelah sebuah kata dijawab benar 3 kali, supaya tidak tertukar.": "Tip: get to know the words through other question types first. In Mixed, synonyms/antonyms only appear after a word has 3 correct answers, so they don't get mixed up.",
    "Belum ada kata dengan sinonim/antonim di sumber kata ini.": "No words with synonyms/antonyms in this word source yet.",
    "Belum ada kata dengan kalimat rumpang di sumber kata ini.": "No words with a fill-in sentence in this word source yet.",
    "Belum ada kata dengan baris pecah di sumber kata ini.": "No words with a parts line in this word source yet.",
    "Belum ada soal untuk jenis ini.": "No questions for this type yet.",
    // kata saya
    "Tambahkan kata dari bacaanmu. Kata langsung ikut di ronde terpandu dan latihan bebas.": "Add words from your reading. They go straight into guided rounds and free practice.",
    "Tempel banyak kata": "Paste many words", "Isi satu per satu": "Add one by one",
    "Tempel daftar kata": "Paste a word list",
    "Satu kata per blok, pisahkan dengan baris kosong. Formatnya ada di bawah.": "One word per block, separated by a blank line. The format is below.",
    "Isi contoh": "Fill example", "Periksa": "Check", "Format": "Format",
    "Wajib": "Required",
    ", minimal 1 baris per blok. Jenis:": ", at least 1 line per block. Types:",
    ". Kalau tidak ditulis, sistem menebak dari akhiran (-tion, -ous, -ly, dll.).": ". If left out, the app guesses from the suffix (-tion, -ous, -ly, etc.).",
    "kata (jenis) = arti": "word (type) = meaning",
    "pecah: kata = potongan (arti) + potongan (arti)": "parts: word = piece (meaning) + piece (meaning)",
    "kalimat: kalimat dengan ___ = jawaban": "sentence: a sentence with ___ = answer",
    "alasan: penjelasan singkat": "why: a short explanation",
    "sinonim: kata = arti": "synonym: word = meaning",
    "antonim: kata = arti": "antonym: word = meaning",
    "Opsional. Hanya untuk kata yang punya imbuhan jelas.": "Optional. Only for words with clear affixes.",
    "Opsional. Jawaban harus salah satu bentuk kata di blok itu.": "Optional. The answer must be one of the word forms in that block.",
    "Opsional. Muncul setelah menjawab soal kalimat.": "Optional. Shown after you answer the sentence question.",
    "Opsional. Lebih dari satu? Pisahkan dengan titik koma (;).": "Optional. More than one? Separate them with a semicolon (;).",
    "Opsional.": "Optional.",
    "Instruksi untuk AI": "Instructions for AI", "Biar AI yang menyusun formatnya": "Let AI do the formatting",
    "Salin instruksi ini, tempel ke ChatGPT atau Claude bersama daftar katamu, lalu tempel hasilnya ke kotak di atas dan klik Periksa.": "Copy these instructions, paste them into ChatGPT or Claude with your word list, then paste the result into the box above and tap Check.",
    "Salin instruksi": "Copy instructions", "Lihat isi instruksi": "Show the instructions",
    "Tersalin ✓": "Copied ✓", "Gagal, salin manual": "Failed, copy manually",
    "Hasil pemeriksaan": "Check results", "Kotaknya masih kosong.": "The box is empty.",
    "Blok merah tidak ikut disimpan dan tetap di kotak supaya bisa diperbaiki.": "Red blocks aren't saved; they stay in the box so you can fix them.",
    "baru": "new", "perbarui": "update", "perlu diperbaiki": "needs fixing",
    "Semua kata saya sudah dihapus. Tempel daftar kata baru di sini.": "All your words were deleted. Paste a new word list here.",
    "Gagal menyimpan: penyimpanan browser tidak tersedia.": "Couldn't save: browser storage is unavailable.",
    "Edit kata": "Edit word", "Bentuk kata": "Word forms",
    "Wajib minimal 1. Baris pertama jadi kata utama. Tambah bentuk lain kalau ada.": "At least 1 required. The first row is the main word. Add other forms if there are any.",
    "Kata": "Word", "Jenis": "Type", "Arti": "Meaning",
    "+ Tambah bentuk": "+ Add form", "+ Tambah potongan": "+ Add part",
    "Tambahan (opsional)": "Extras (optional)",
    "Pecah kata, kalimat rumpang, sinonim & antonim": "Word parts, fill-in sentence, synonyms & antonyms",
    "Lewati kalau katanya tidak punya imbuhan yang jelas.": "Skip this if the word has no clear affixes.",
    "Kata yang dipecah": "Word to split", "Kalimat rumpang": "Fill-in sentence",
    "Tulis ___ (tiga garis bawah) di tempat kosong.": "Write ___ (three underscores) for the blank.",
    "Kalimat": "Sentence", "Jawaban": "Answer", "Alasan": "Reason",
    "Padanan dan lawan dari kata utama.": "Synonyms and opposites of the main word.",
    "Arti sinonim": "Synonym meaning", "Arti antonim": "Antonym meaning",
    "Simpan kata": "Save word", "Simpan perubahan": "Save changes",
    "— pilih —": "— choose —",
    "Setiap bentuk kata harus diisi kata dan artinya.": "Every word form needs both the word and its meaning.",
    "Isi minimal 1 kata.": "Enter at least 1 word.",
    "Ada bentuk kata dengan jenis yang sama ditulis dua kali.": "A word form with the same type is written twice.",
    "Kolom potongan tidak boleh kosong (artinya boleh).": "The part field can't be empty (its meaning can).",
    "Pilih kata yang dipecah.": "Choose the word to split.",
    "Kalimat harus memuat ___ (tiga garis bawah) sebagai tempat kosong.": "The sentence must contain ___ (three underscores) as the blank.",
    "Pilih jawaban untuk kalimat rumpang.": "Choose the answer for the fill-in sentence.",
    "Belum ada. Kata yang kamu simpan akan muncul di sini.": "Nothing yet. Words you save will appear here.",
    "Hapus semua": "Delete all",
    "Cadangan & pindah perangkat": "Backup & moving devices", "Ekspor / impor": "Export / import",
    "Kata hanya tersimpan di browser ini. Ekspor untuk cadangan, lalu impor di HP atau laptop lain.": "Words are only stored in this browser. Export a backup, then import it on another phone or laptop.",
    "Ekspor": "Export", "Impor": "Import",
    "Belum ada kata untuk diekspor.": "No words to export yet.",
    "File tidak bisa dibaca. Pastikan ini file hasil Ekspor Vocab Lab.": "The file couldn't be read. Make sure it's a Vocab Lab export file.",
    "kata saya": "my word", "saya": "mine",
    "baris pecah masih kosong": "the parts line is empty",
    "belum ada baris kata, contoh: kata (n) = arti": "no word line yet, for example: word (n) = meaning",
    "kalimat harus memuat ___ (tiga garis bawah)": "the sentence must contain ___ (three underscores)",
    "kalimat belum punya jawaban, tambahkan = jawaban di akhir": "the sentence has no answer yet, add = answer at the end",
    // progres
    "Satu kata dianggap dikuasai setelah 3 jawaban benar di soal kata itu (pecah kata, jenis kata, isi kalimat, sinonim/antonim). Soal imbuhan dicatat terpisah.": "A word counts as mastered after 3 correct answers on that word's questions (word parts, word type, fill the blank, synonym/antonym). Affix questions are tracked separately.",
    "kata dikuasai": "words mastered", "menuju semua dikuasai": "toward mastering all", "total jawaban benar": "total correct answers",
    "Per kata · ■ = 1 jawaban benar": "Per word · ■ = 1 correct answer",
    "Reset progres": "Reset progress",
    // atribut
    "kata": "word", "arti": "meaning", "potongan": "part", "arti potongan": "part meaning",
    "Hapus baris": "Remove row", "Kurangi": "Decrease", "Tambah": "Increase",
    // dialog
    "Akhiri ronde ini? Jawaban yang sudah masuk tetap tercatat.": "End this round? Answers you've already given stay recorded.",
    "Hapus semua progres? Kata saya tidak ikut terhapus.": "Delete all progress? Your words won't be deleted."
  };

  const FIELD = { pecah: "parts", kalimat: "sentence", sinonim: "synonym", antonim: "antonym" };
  const forms = n => `${n} ${+n === 1 ? "form" : "forms"}`;
  const words = n => `${n} ${+n === 1 ? "word" : "words"}`;

  // ---------- pola dengan angka / kata dinamis ----------
  const RULES = [
    [/^Benar (\d+)\/(\d+)$/, (m, a, b) => `Correct ${a}/${b}`],
    [/^(\d+)\/(\d+) benar$/, (m, a, b) => `${a}/${b} correct`],
    [/^Soal (\d+) dari (\d+)$/, (m, a, b) => `Question ${a} of ${b}`],
    [/^Langkah (\d+) · (.+)$/, (m, a, t) => `Step ${a} · ${tr(t)}`],
    [/^Lanjut: (.+)$/, (m, t) => `Next: ${tr(t)}`],
    [/^Mulai ronde · (\d+) kata$/, (m, n) => `Start round · ${words(n)}`],
    [/^(\d+)\/(\d+) kata dikuasai$/, (m, a, b) => `${a}/${b} words mastered`],
    [/^Daftar kata saya \((\d+)\)$/, (m, n) => `My word list (${n})`],
    [/^Hanya kata saya \((\d+)\)$/, (m, n) => `Only my words (${n})`],
    [/^Kata saya \((\d+)\) \+ (\d+) kata contoh$/, (m, a, b) => `My words (${a}) + ${b} example words`],
    [/^Sertakan (\d+) kata contoh bawaan$/, (m, n) => `Include ${n} built-in example words`],
    [/^Tambahkan kata di menu Kata saya, atau pakai (\d+) kata contoh dulu untuk mencoba\.$/, (m, n) => `Add words in the My words menu, or try the ${n} example words first.`],
    [/^Simpan (\d+) kata$/, (m, n) => `Save ${words(n)}`],
    [/^(\d+) kata terbaca · (\d+) siap disimpan(?: · (\d+) perlu diperbaiki)?\. Cocokkan jumlahnya dengan daftar aslimu\.$/,
      (m, a, b, c) => `${words(a)} read · ${b} ready to save${c ? ` · ${c} need fixing` : ""}. Compare the count with your original list.`],
    [/^(\d+) dari (\d+) kata tersimpan\. Total kata saya sekarang (\d+)\.(?: (\d+) blok yang perlu diperbaiki masih di kotak\.)?$/,
      (m, a, b, c, d) => `${a} of ${words(b)} saved. You now have ${words(c)}.${d ? ` ${d} block(s) that need fixing are still in the box.` : ""}`],
    [/^(\d+) kata diekspor ke (.+)\.$/, (m, n, f) => `${words(n)} exported to ${f}.`],
    [/^Impor selesai: (\d+) kata baru, (\d+) diperbarui(?:, (\d+) dilewati)?\.$/, (m, a, b, c) => `Import done: ${a} new, ${b} updated${c ? `, ${c} skipped` : ""}.`],
    [/^"(.+)" tersimpan dan langsung ikut latihan\.$/, (m, w) => `"${w}" saved and added to practice.`],
    [/^"(.+)" sudah ada di daftar kata\.$/, (m, w) => `"${w}" is already in your word list.`],
    [/^(\d+)% jawaban benar$/, (m, n) => `${n}% correct`],
    [/^Diambil acak dari (\d+) kata\. Yang belum dikuasai lebih sering terpilih\.$/, (m, n) => `Picked at random from ${words(n)}. Words you haven't mastered come up more often.`],
    [/^· (\d+) bentuk · ([\s\S]+)$/, (m, n, a) => `· ${forms(n)} · ${a}`],
    [/^(\d+) bentuk((?: · (?:pecah|kalimat|sinonim|antonim))*)$/, (m, n, rest) => forms(n) + rest.replace(/pecah|kalimat|sinonim|antonim/g, k => FIELD[k])],
    [/^jebakan: antonim dari (.+)$/, (m, w) => `trap: antonym of ${w}`],
    [/^jebakan: sinonim dari (.+)$/, (m, w) => `trap: synonym of ${w}`],
    [/^jenis "(.+)" ditebak dari akhirannya: (\w+)\. Cek lagi, ya\.$/, (m, w, p) => `the type of "${w}" was guessed from its suffix: ${p}. Please double-check.`],
    [/^jenis kata "(.+)" belum ditulis, contoh: ([\s\S]+)$/, (m, w, ex) => `the word type of "${w}" is missing, for example: ${ex}`],
    [/^jenis kata "\((.*)\)" pada "(.+)" tidak dikenali, pakai n, v, adj, atau adv$/, (m, p, w) => `word type "(${p})" for "${w}" isn't recognized, use n, v, adj, or adv`],
    [/^baris tidak dikenali: "([\s\S]+)" \(contoh: kata \(n\) = arti\)$/, (m, l) => `line not recognized: "${l}" (example: word (n) = meaning)`],
    [/^"(.+)" ditulis dua kali$/, (m, w) => `"${w}" is written twice`],
    [/^kata "(.+)" di baris pecah tidak ada di blok ini$/, (m, w) => `the word "${w}" in the parts line isn't in this block`],
    [/^jawaban "(.+)" tidak ada di bentuk kata blok ini$/, (m, w) => `the answer "${w}" isn't one of the word forms in this block`],
    [/^"(.+)" sudah ada di blok lain di daftar ini, jadi hanya satu yang disimpan$/, (m, w) => `"${w}" already appears in another block of this list, so only one is saved`],
    [/^"(.+)" sepertinya kata lain, bukan bentuk dari "(.+)"\. Kalau memang kata lain, pisahkan dengan baris kosong supaya tersimpan sendiri\.$/,
      (m, a, b) => `"${a}" looks like a different word, not a form of "${b}". If so, separate it with a blank line so it's saved on its own.`],
    [/^Hapus "(.+)" dari kata saya\?$/, (m, w) => `Delete "${w}" from your words?`],
    [/^Hapus semua (\d+) kata saya beserta progresnya\? Ini tidak bisa dibatalkan\.\s+Kalau ingin menyimpan cadangan, batalkan dulu lalu klik Ekspor\.$/,
      (m, n) => `Delete all ${words(n)} and their progress? This can't be undone.\n\nTo keep a backup, cancel first and tap Export.`]
  ];

  // ---------- potongan kalimat di dalam penjelasan ----------
  const PHRASES = [
    [" (kata benda), artinya kira-kira ", ", roughly meaning "],
    [" (kata kerja), artinya kira-kira ", ", roughly meaning "],
    [" (kata sifat), artinya kira-kira ", ", roughly meaning "],
    [" (kata keterangan), artinya kira-kira ", ", roughly meaning "],
    ["Petunjuk: akhiran", "Hint: the suffix"],
    ["biasanya membentuk ", "usually forms "],
    ["Antonimnya:", "Antonym:"], ["Sinonimnya:", "Synonym:"],
    ["Jawaban:", "Answer:"], ["Contoh:", "Examples:"],
    ["Hati-hati: in- kadang berarti 'ke dalam' (infer, include).", "Careful: in- sometimes means 'into' (infer, include)."]
  ];

  function tr(s) {
    if (lang !== "en" || !s) return s;
    const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], core = s.trim();
    if (!core) return s;
    if (Object.prototype.hasOwnProperty.call(EXACT, core)) return lead + EXACT[core] + trail;
    for (const [re, fn] of RULES) { const m = core.match(re); if (m) return lead + fn(...m) + trail; }
    let out = s;
    for (const [a, b] of PHRASES) if (out.includes(a)) out = out.split(a).join(b);
    return out;
  }
  window.VL_tr = tr;

  const SKIP = "script,style,textarea,pre,[data-nt]";
  function trNode(n) {
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) return;
    const v = n.nodeValue, t = tr(v);
    if (t !== v) n.nodeValue = t;
  }
  function trAttrs(el) {
    if (el.closest && el.closest(SKIP)) return;
    for (const a of ["placeholder", "title", "aria-label"]) {
      const v = el.getAttribute && el.getAttribute(a);
      if (v) { const t = tr(v); if (t !== v) el.setAttribute(a, t); }
    }
  }
  function trTree(root) {
    if (root.nodeType === 3) return trNode(root);
    if (root.nodeType !== 1) return;
    trAttrs(root);
    root.querySelectorAll("[placeholder],[title],[aria-label]").forEach(trAttrs);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) trNode(n);
  }

  // dialog konfirmasi ikut diterjemahkan
  const nativeConfirm = window.confirm.bind(window);
  window.confirm = msg => nativeConfirm(tr(String(msg)));

  // tombol ID / EN
  function bindLang() {
    document.querySelectorAll("#langSeg button").forEach(b => {
      b.classList.toggle("active", b.dataset.l === lang);
      b.onclick = () => {
        if (b.dataset.l === lang) return;
        let cur = {};
        try { cur = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cur = {}; }
        cur.lang = b.dataset.l;
        try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {}
        location.reload();
      };
    });
  }

  function start() {
    bindLang();
    if (lang !== "en") return;
    document.documentElement.lang = "en";
    trTree(document.body);
    new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === "characterData") trNode(m.target);
        else if (m.type === "attributes") trAttrs(m.target);
        else m.addedNodes.forEach(trTree);
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title", "aria-label"] });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
