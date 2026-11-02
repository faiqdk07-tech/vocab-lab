// =====================================================
//  DATA VOCAB LAB
//  Tambah kata baru cukup di file ini, app.js tidak perlu diubah.
// =====================================================

// ---------- IMBUHAN & AKAR KATA ----------
const AFFIXES = {
  prefix: [
    { form: "un- / in- / im- / il- / ir-", meaning: "tidak", ex: "unclear, indispensable, impossible, illegible, irregular", note: "Hati-hati: in- kadang berarti 'ke dalam' (infer, include)." },
    { form: "dis-", meaning: "kebalikan / menghilangkan", ex: "disagree, disappear" },
    { form: "mis-", meaning: "salah / keliru", ex: "misunderstand, mislead" },
    { form: "pre-", meaning: "sebelum", ex: "predict, precede" },
    { form: "re-", meaning: "lagi / kembali", ex: "rewrite, return" },
    { form: "contra- / counter-", meaning: "melawan / berlawanan", ex: "contradict, counterattack" },
    { form: "inter-", meaning: "di antara", ex: "international, interact" },
    { form: "sub- / sus-", meaning: "di bawah", ex: "submarine, sustain" },
    { form: "trans-", meaning: "melintasi / berpindah", ex: "transport, translate" },
    { form: "ambi-", meaning: "dua / kedua sisi", ex: "ambiguous, ambivalent" },
    { form: "over-", meaning: "berlebihan", ex: "overestimate, overload" },
    { form: "de-", meaning: "menjauh / menurunkan", ex: "decrease, deceive" }
  ],
  root: [
    { form: "dict", meaning: "berkata", ex: "predict, contradict, dictionary" },
    { form: "vis / vid", meaning: "melihat", ex: "visible, video, visualize" },
    { form: "port", meaning: "membawa", ex: "transport, export" },
    { form: "fer", meaning: "membawa", ex: "infer, transfer" },
    { form: "ced / cede", meaning: "pergi / bergerak", ex: "precede, exceed" },
    { form: "cept / ceive", meaning: "mengambil", ex: "deceive, accept, receive" },
    { form: "leg / lect", meaning: "membaca", ex: "legible, lecture" },
    { form: "ver", meaning: "benar", ex: "verify, verdict" },
    { form: "scrib / script", meaning: "menulis", ex: "describe, manuscript" },
    { form: "aud", meaning: "mendengar", ex: "audio, audience" },
    { form: "bene", meaning: "baik", ex: "benefit, beneficial" },
    { form: "mal", meaning: "buruk", ex: "malfunction, malnutrition" },
    { form: "tain / ten", meaning: "memegang", ex: "sustain, maintain, retain" }
  ],
  suffix: [
    { form: "-tion / -sion", pos: "noun", meaning: "proses / hasil", ex: "prediction, decision" },
    { form: "-ment", pos: "noun", meaning: "hasil / keadaan", ex: "agreement, development" },
    { form: "-ness", pos: "noun", meaning: "keadaan / sifat", ex: "eagerness, kindness" },
    { form: "-ity", pos: "noun", meaning: "keadaan / sifat", ex: "scarcity, hostility" },
    { form: "-ance / -ence", pos: "noun", meaning: "keadaan / tindakan", ex: "reluctance, inference" },
    { form: "-er / -or", pos: "noun", meaning: "pelaku / alat", ex: "dispenser, editor" },
    { form: "-ous", pos: "adjective", meaning: "bersifat / penuh", ex: "ambiguous, dangerous" },
    { form: "-ive", pos: "adjective", meaning: "bersifat / cenderung", ex: "deceptive, active" },
    { form: "-able / -ible", pos: "adjective", meaning: "dapat di-", ex: "predictable, legible" },
    { form: "-ful", pos: "adjective", meaning: "penuh", ex: "careful, helpful" },
    { form: "-less", pos: "adjective", meaning: "tanpa", ex: "careless, endless" },
    { form: "-al", pos: "adjective", meaning: "berkaitan dengan", ex: "national, cultural" },
    { form: "-ory", pos: "adjective", meaning: "bersifat", ex: "contradictory, mandatory" },
    { form: "-ly", pos: "adverb", meaning: "dengan cara", ex: "eagerly, reluctantly" },
    { form: "-ize / -ise", pos: "verb", meaning: "menjadikan", ex: "visualize, modernize" },
    { form: "-ify", pos: "verb", meaning: "membuat menjadi", ex: "verify, simplify" },
    { form: "-en", pos: "verb", meaning: "membuat menjadi", ex: "strengthen, widen" }
  ]
};

// ---------- KELUARGA KATA ----------
// forms    : semua bentuk kata + jenis kata (noun/verb/adjective/adverb) + arti
// parts    : satu kata yang dipecah jadi prefix/root/suffix
// sentence : kalimat rumpang, answer harus salah satu dari forms
// focus    : kata acuan untuk soal sinonim/antonim (harus ada di forms)
const FAMILIES = [
  {
    id: "deceive",
    forms: [
      { w: "deceive", pos: "verb", arti: "menipu" },
      { w: "deception", pos: "noun", arti: "penipuan" },
      { w: "deceptive", pos: "adjective", arti: "menyesatkan" }
    ],
    parts: { w: "deceptive", list: [["de-", "menjauh"], ["cept", "mengambil"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "The ___ advertisement made the product look far better than it really was.", answer: "deceptive", why: "Sebelum noun (advertisement) butuh adjective." },
    focus: "deceptive",
    synonyms: [{ w: "misleading", arti: "menyesatkan" }],
    antonyms: [{ w: "honest", arti: "jujur" }]
  },
  {
    id: "predict",
    forms: [
      { w: "predict", pos: "verb", arti: "memperkirakan" },
      { w: "prediction", pos: "noun", arti: "perkiraan" },
      { w: "predictable", pos: "adjective", arti: "mudah ditebak" }
    ],
    parts: { w: "predictable", list: [["pre-", "sebelum"], ["dict", "berkata"], ["-able", "adjective: dapat di-"]] },
    sentence: { text: "The ending of the film was so ___ that nobody was surprised.", answer: "predictable", why: "Pola 'so ___ that' diisi adjective." },
    focus: "predictable",
    synonyms: [{ w: "foreseeable", arti: "dapat diperkirakan" }],
    antonyms: [{ w: "unexpected", arti: "tak terduga" }]
  },
  {
    id: "scarce",
    forms: [
      { w: "scarce", pos: "adjective", arti: "langka" },
      { w: "scarcity", pos: "noun", arti: "kelangkaan" },
      { w: "scarcely", pos: "adverb", arti: "hampir tidak" }
    ],
    parts: { w: "scarcity", list: [["scarc(e)", "langka"], ["-ity", "noun: keadaan"]] },
    sentence: { text: "Water ___ has become a serious problem in many dry regions.", answer: "scarcity", why: "Posisi subjek sebelum 'has become' butuh noun (water scarcity = kelangkaan air)." },
    focus: "scarce",
    synonyms: [{ w: "rare", arti: "jarang" }],
    antonyms: [{ w: "abundant", arti: "melimpah" }]
  },
  {
    id: "abundant",
    forms: [
      { w: "abound", pos: "verb", arti: "berlimpah" },
      { w: "abundance", pos: "noun", arti: "kelimpahan" },
      { w: "abundant", pos: "adjective", arti: "melimpah" },
      { w: "abundantly", pos: "adverb", arti: "secara melimpah" }
    ],
    parts: { w: "abundance", list: [["abund", "melimpah"], ["-ance", "noun: keadaan"]] },
    sentence: { text: "Fish are ___ in the warm coastal waters, so local fishermen rarely go home empty-handed.", answer: "abundant", why: "Setelah to be (are) butuh adjective." },
    focus: "abundant",
    synonyms: [{ w: "plentiful", arti: "berlimpah" }],
    antonyms: [{ w: "scarce", arti: "langka" }]
  },
  {
    id: "reluctant",
    forms: [
      { w: "reluctance", pos: "noun", arti: "keengganan" },
      { w: "reluctant", pos: "adjective", arti: "enggan" },
      { w: "reluctantly", pos: "adverb", arti: "dengan enggan" }
    ],
    parts: { w: "reluctantly", list: [["reluctant", "enggan"], ["-ly", "adverb: dengan cara"]] },
    sentence: { text: "She ___ agreed to join the project after hours of persuasion.", answer: "reluctantly", why: "Menerangkan verb (agreed) butuh adverb." },
    focus: "reluctant",
    synonyms: [{ w: "unwilling", arti: "tidak mau" }],
    antonyms: [{ w: "eager", arti: "bersemangat" }]
  },
  {
    id: "precede",
    forms: [
      { w: "precede", pos: "verb", arti: "mendahului" },
      { w: "precedent", pos: "noun", arti: "preseden (kejadian serupa sebelumnya)" },
      { w: "unprecedented", pos: "adjective", arti: "belum pernah terjadi sebelumnya" }
    ],
    parts: { w: "unprecedented", list: [["un-", "tidak"], ["pre-", "sebelum"], ["ced", "pergi"], ["-ent", "pembentuk kata"], ["-ed", "pembentuk adjective"]] },
    sentence: { text: "The pandemic caused an ___ drop in global travel.", answer: "unprecedented", why: "Di antara 'an' dan noun (drop) butuh adjective." },
    focus: "unprecedented",
    synonyms: [{ w: "unparalleled", arti: "tiada bandingnya" }],
    antonyms: [{ w: "ordinary", arti: "biasa" }]
  },
  {
    id: "dispense",
    forms: [
      { w: "dispense", pos: "verb", arti: "membagikan" },
      { w: "dispenser", pos: "noun", arti: "alat pembagi (dispenser)" },
      { w: "indispensable", pos: "adjective", arti: "sangat diperlukan" }
    ],
    parts: { w: "indispensable", list: [["in-", "tidak"], ["dispens", "melepas / membagikan"], ["-able", "adjective: dapat di-"]] },
    sentence: { text: "A good dictionary is ___ for language learners.", answer: "indispensable", why: "Setelah to be (is) butuh adjective." },
    focus: "indispensable",
    synonyms: [{ w: "essential", arti: "sangat penting" }],
    antonyms: [{ w: "unnecessary", arti: "tidak perlu" }]
  },
  {
    id: "ambiguous",
    forms: [
      { w: "ambiguity", pos: "noun", arti: "makna ganda" },
      { w: "ambiguous", pos: "adjective", arti: "bermakna ganda" },
      { w: "ambiguously", pos: "adverb", arti: "secara ambigu" }
    ],
    parts: { w: "ambiguous", list: [["ambi-", "dua / kedua sisi"], ["gu", "akar Latin: bergerak"], ["-ous", "adjective: bersifat"]] },
    sentence: { text: "The instructions were so ___ that every student interpreted them differently.", answer: "ambiguous", why: "Pola 'so ___ that' diisi adjective." },
    focus: "ambiguous",
    synonyms: [{ w: "vague", arti: "samar" }],
    antonyms: [{ w: "clear", arti: "jelas" }]
  },
  {
    id: "verify",
    forms: [
      { w: "verify", pos: "verb", arti: "memastikan kebenaran" },
      { w: "verification", pos: "noun", arti: "verifikasi" },
      { w: "verifiable", pos: "adjective", arti: "dapat dibuktikan" }
    ],
    parts: { w: "verifiable", list: [["ver", "benar"], ["-ifi", "membuat menjadi"], ["-able", "adjective: dapat di-"]] },
    sentence: { text: "Scientists need ___ evidence before accepting a new claim.", answer: "verifiable", why: "Sebelum noun (evidence) butuh adjective." },
    focus: "verify",
    synonyms: [{ w: "confirm", arti: "memastikan" }],
    antonyms: [{ w: "disprove", arti: "membuktikan salah" }]
  },
  {
    id: "contradict",
    forms: [
      { w: "contradict", pos: "verb", arti: "bertentangan dengan" },
      { w: "contradiction", pos: "noun", arti: "pertentangan" },
      { w: "contradictory", pos: "adjective", arti: "saling bertentangan" }
    ],
    parts: { w: "contradictory", list: [["contra-", "melawan"], ["dict", "berkata"], ["-ory", "adjective: bersifat"]] },
    sentence: { text: "The two reports gave ___ figures, so the editor checked them again.", answer: "contradictory", why: "Sebelum noun (figures) butuh adjective." },
    focus: "contradictory",
    synonyms: [{ w: "conflicting", arti: "bertentangan" }],
    antonyms: [{ w: "consistent", arti: "konsisten" }]
  },
  {
    id: "visible",
    forms: [
      { w: "visible", pos: "adjective", arti: "terlihat" },
      { w: "visibility", pos: "noun", arti: "jarak pandang" },
      { w: "visualize", pos: "verb", arti: "membayangkan" }
    ],
    parts: { w: "visibility", list: [["vis", "melihat"], ["-ibil", "dapat"], ["-ity", "noun: keadaan"]] },
    sentence: { text: "Heavy fog reduced ___ on the highway to less than ten meters.", answer: "visibility", why: "Objek setelah verb (reduced) butuh noun." },
    focus: "visible",
    synonyms: [{ w: "noticeable", arti: "mudah terlihat" }],
    antonyms: [{ w: "hidden", arti: "tersembunyi" }]
  },
  {
    id: "eager",
    forms: [
      { w: "eager", pos: "adjective", arti: "bersemangat" },
      { w: "eagerly", pos: "adverb", arti: "dengan bersemangat" },
      { w: "eagerness", pos: "noun", arti: "semangat" }
    ],
    parts: { w: "eagerness", list: [["eager", "bersemangat"], ["-ness", "noun: keadaan"]] },
    sentence: { text: "The children waited ___ for the results to be announced.", answer: "eagerly", why: "Menerangkan verb (waited) butuh adverb." },
    focus: "eager",
    synonyms: [{ w: "enthusiastic", arti: "antusias" }],
    antonyms: [{ w: "reluctant", arti: "enggan" }]
  },
  {
    id: "hostile",
    forms: [
      { w: "hostile", pos: "adjective", arti: "bermusuhan" },
      { w: "hostility", pos: "noun", arti: "permusuhan" }
    ],
    parts: { w: "hostility", list: [["hostil", "musuh"], ["-ity", "noun: keadaan"]] },
    sentence: { text: "There was open ___ between the two neighbors after the dispute over the land.", answer: "hostility", why: "Setelah adjective (open) butuh noun." },
    focus: "hostile",
    synonyms: [{ w: "unfriendly", arti: "tidak ramah" }],
    antonyms: [{ w: "friendly", arti: "ramah" }]
  },
  {
    id: "legible",
    forms: [
      { w: "legible", pos: "adjective", arti: "dapat dibaca" },
      { w: "illegible", pos: "adjective", arti: "tidak dapat dibaca" },
      { w: "legibility", pos: "noun", arti: "keterbacaan" }
    ],
    parts: { w: "illegible", list: [["il-", "tidak"], ["leg", "membaca"], ["-ible", "adjective: dapat di-"]] },
    sentence: { text: "His handwriting was so messy that the note was almost ___.", answer: "illegible", why: "Setelah to be (was) butuh adjective; tulisan berantakan berarti tidak terbaca." },
    focus: "legible",
    synonyms: [{ w: "readable", arti: "dapat dibaca" }],
    antonyms: [{ w: "unreadable", arti: "tidak terbaca" }]
  },
  {
    id: "sustain",
    forms: [
      { w: "sustain", pos: "verb", arti: "mempertahankan" },
      { w: "sustainable", pos: "adjective", arti: "berkelanjutan" },
      { w: "sustainability", pos: "noun", arti: "keberlanjutan" }
    ],
    parts: { w: "sustainability", list: [["sus-", "di bawah (menopang)"], ["tain", "memegang"], ["-abil", "dapat"], ["-ity", "noun: keadaan"]] },
    sentence: { text: "Many cities now invest in ___ energy such as solar and wind power.", answer: "sustainable", why: "Sebelum noun (energy) butuh adjective." },
    focus: "sustain",
    synonyms: [{ w: "maintain", arti: "mempertahankan" }],
    antonyms: [{ w: "abandon", arti: "meninggalkan" }]
  },
  {
    id: "infer",
    forms: [
      { w: "infer", pos: "verb", arti: "menyimpulkan" },
      { w: "inference", pos: "noun", arti: "kesimpulan" }
    ],
    parts: { w: "inference", list: [["in-", "ke dalam"], ["fer", "membawa"], ["-ence", "noun: tindakan"]] },
    sentence: { text: "From the author's tone, we can ___ that she disapproves of the new policy.", answer: "infer", why: "Setelah modal (can) butuh verb bentuk dasar." },
    focus: "infer",
    synonyms: [{ w: "deduce", arti: "menyimpulkan" }],
    antonyms: []
  }
];
