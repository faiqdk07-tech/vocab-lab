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
    { form: "de-", meaning: "menjauh / menurunkan", ex: "decrease, deceive" },
    { form: "ex- / e-", meaning: "keluar", ex: "export, emit, evident" },
    { form: "pro-", meaning: "ke depan / maju", ex: "produce, provoke, progress" },
    { form: "com- / con-", meaning: "bersama / sepenuhnya", ex: "construct, compel, consume" },
    { form: "per-", meaning: "melalui / terus-menerus", ex: "persist, perform" },
    { form: "ob-", meaning: "melawan / menghalangi", ex: "obstruct, object" }
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
    { form: "tain / ten", meaning: "memegang", ex: "sustain, maintain, retain" },
    { form: "spect", meaning: "melihat", ex: "inspect, spectator, perspective" },
    { form: "struct", meaning: "membangun", ex: "construct, structure, obstruct" },
    { form: "duc / duct", meaning: "memimpin / membawa", ex: "produce, conduct, educate" },
    { form: "mit / miss", meaning: "mengirim", ex: "transmit, emit, mission" },
    { form: "cred", meaning: "percaya", ex: "credible, credit, incredible" },
    { form: "voc / vok", meaning: "memanggil / suara", ex: "provoke, vocal, advocate" },
    { form: "rupt", meaning: "pecah", ex: "disrupt, interrupt, erupt" },
    { form: "ject", meaning: "melempar", ex: "reject, project, inject" },
    { form: "tract", meaning: "menarik", ex: "attract, extract, tractor" },
    { form: "mot / mov", meaning: "bergerak", ex: "motivate, motion, remove" },
    { form: "pend / pens", meaning: "menggantung", ex: "suspend, pending, pendant" },
    { form: "sequ / secu", meaning: "mengikuti", ex: "consequence, sequence, consecutive" },
    { form: "flu / flux", meaning: "mengalir", ex: "fluent, fluid, influx" },
    { form: "sist / sta", meaning: "berdiri / tetap", ex: "persist, resist, stable" },
    { form: "vers / vert", meaning: "berbalik / berputar", ex: "reverse, convert, diverse" },
    { form: "sum / sumpt", meaning: "mengambil", ex: "assume, consume, consumption" },
    { form: "puls / pel", meaning: "mendorong", ex: "compel, compulsory, expel" },
    { form: "plic / ply", meaning: "melipat", ex: "explicit, implicit, complicated" },
    { form: "sign", meaning: "tanda", ex: "signify, signal, signature" }
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
    { form: "-en", pos: "verb", meaning: "membuat menjadi", ex: "strengthen, widen" },
    { form: "-ant / -ent", pos: "adjective", meaning: "bersifat", ex: "hesitant, persistent, evident" },
    { form: "-ic / -ical", pos: "adjective", meaning: "berkaitan dengan", ex: "analytical, economic, historic" },
    { form: "-ate", pos: "verb", meaning: "melakukan / membuat", ex: "motivate, tolerate, activate", note: "Kadang -ate juga membentuk adjective (accurate, fortunate)." },
    { form: "-ist / -ian", pos: "noun", meaning: "orang yang ahli / pelaku", ex: "scientist, librarian, analyst" }
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
    more: [{ text: "The magician did not want to ___ anyone; the trick was only part of the show.", answer: "deceive", why: "Setelah 'to' butuh verb bentuk dasar." }],
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
    more: [{ text: "Economists ___ that inflation will fall next year.", answer: "predict", why: "Setelah subjek jamak (economists) sebagai predikat butuh verb." }],
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
    more: [{ text: "Clean water is ___ in the desert village, so every drop is saved.", answer: "scarce", why: "Setelah to be (is) butuh adjective." }],
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
    more: [{ text: "The region has an ___ of natural resources, especially coal and nickel.", answer: "abundance", why: "Setelah 'an' dan sebelum 'of' butuh noun." }],
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
    more: [{ text: "Many students are ___ to speak English in class because they fear making mistakes.", answer: "reluctant", why: "Setelah to be (are) butuh adjective." }],
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
    more: [{ text: "A short speech will ___ the award ceremony.", answer: "precede", why: "Setelah modal (will) butuh verb bentuk dasar." }],
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
    more: [{ text: "The machine in the lobby can ___ hot and cold drinks.", answer: "dispense", why: "Setelah modal (can) butuh verb bentuk dasar." }],
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
    more: [{ text: "The ___ of the headline confused many readers.", answer: "ambiguity", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
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
    more: [{ text: "Please ___ your email address before logging in.", answer: "verify", why: "Kalimat perintah setelah 'please' butuh verb bentuk dasar." }],
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
    more: [{ text: "The witness's new statement seemed to ___ what she had said earlier.", answer: "contradict", why: "Setelah 'to' butuh verb bentuk dasar." }],
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
    more: [{ text: "The stars were clearly ___ once the city lights went out.", answer: "visible", why: "Setelah to be (were) dan adverb (clearly) butuh adjective." }],
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
    more: [{ text: "She was ___ to start her first day at university.", answer: "eager", why: "Setelah to be (was) butuh adjective." }],
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
    more: [{ text: "The villagers were ___ toward the company that wanted to clear their forest.", answer: "hostile", why: "Setelah to be (were) butuh adjective." }],
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
    more: [{ text: "Please write clearly so that your answers are ___.", answer: "legible", why: "Setelah to be (are) butuh adjective; menulis dengan jelas supaya dapat dibaca." }],
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
    more: [{ text: "The country needs steady investment to ___ its economic growth.", answer: "sustain", why: "Setelah 'to' butuh verb bentuk dasar." }],
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
    more: [{ text: "The reader must make an ___ about the character's feelings.", answer: "inference", why: "Setelah 'an' butuh noun; 'make an inference' = menarik kesimpulan." }],
    focus: "infer",
    synonyms: [{ w: "deduce", arti: "menyimpulkan" }],
    antonyms: []
  },
  // ---------- tambahan: kata akademik umum di bacaan UTBK ----------
  {
    id: "construct",
    forms: [
      { w: "construct", pos: "verb", arti: "membangun / menyusun" },
      { w: "construction", pos: "noun", arti: "pembangunan / konstruksi" },
      { w: "constructive", pos: "adjective", arti: "membangun (bersifat positif)" },
      { w: "constructively", pos: "adverb", arti: "secara membangun" }
    ],
    parts: { w: "constructive", list: [["con-", "bersama"], ["struct", "membangun"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "The teacher gave ___ feedback that helped the students improve their essays.", answer: "constructive", why: "Sebelum noun (feedback) butuh adjective." },
    more: [{ text: "The ___ of the new bridge will take three years.", answer: "construction", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
    focus: "constructive",
    synonyms: [{ w: "helpful", arti: "membantu" }],
    antonyms: [{ w: "destructive", arti: "merusak" }]
  },
  {
    id: "disrupt",
    forms: [
      { w: "disrupt", pos: "verb", arti: "mengganggu / mengacaukan" },
      { w: "disruption", pos: "noun", arti: "gangguan" },
      { w: "disruptive", pos: "adjective", arti: "bersifat mengganggu" }
    ],
    parts: { w: "disruptive", list: [["dis-", "terpisah"], ["rupt", "pecah"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "Heavy rain caused a major ___ to train services across the city.", answer: "disruption", why: "Setelah 'a major' (artikel + adjective) butuh noun." },
    more: [{ text: "Loud phone calls can ___ a lecture for everyone in the room.", answer: "disrupt", why: "Setelah modal (can) butuh verb bentuk dasar." }],
    focus: "disrupt",
    synonyms: [{ w: "interrupt", arti: "menyela / memotong" }],
    antonyms: []
  },
  {
    id: "reject",
    forms: [
      { w: "reject", pos: "verb", arti: "menolak" },
      { w: "rejection", pos: "noun", arti: "penolakan" }
    ],
    parts: { w: "rejection", list: [["re-", "kembali"], ["ject", "melempar"], ["-tion", "noun: hasil"]] },
    sentence: { text: "The committee decided to ___ the proposal because it was too expensive.", answer: "reject", why: "Setelah 'to' butuh verb bentuk dasar." },
    more: [{ text: "After the ___ of his first novel, he kept writing and tried again.", answer: "rejection", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
    focus: "reject",
    synonyms: [{ w: "refuse", arti: "menolak" }, { w: "decline", arti: "menolak dengan sopan" }],
    antonyms: [{ w: "accept", arti: "menerima" }]
  },
  {
    id: "attract",
    forms: [
      { w: "attract", pos: "verb", arti: "menarik (perhatian / minat)" },
      { w: "attraction", pos: "noun", arti: "daya tarik / tempat wisata" },
      { w: "attractive", pos: "adjective", arti: "menarik / memikat" },
      { w: "attractively", pos: "adverb", arti: "dengan menarik" }
    ],
    parts: { w: "attractive", list: [["at-", "ke arah"], ["tract", "menarik"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "The museum's new exhibition is expected to ___ thousands of visitors.", answer: "attract", why: "Setelah 'to' butuh verb bentuk dasar." },
    more: [{ text: "The old harbor has become a popular tourist ___.", answer: "attraction", why: "Setelah adjective (popular) dan noun penjelas (tourist) butuh noun." }],
    focus: "attractive",
    synonyms: [{ w: "appealing", arti: "memikat" }],
    antonyms: [{ w: "unappealing", arti: "tidak menarik" }]
  },
  {
    id: "credible",
    forms: [
      { w: "credible", pos: "adjective", arti: "dapat dipercaya" },
      { w: "credibility", pos: "noun", arti: "kredibilitas / keterpercayaan" },
      { w: "incredible", pos: "adjective", arti: "luar biasa / sulit dipercaya" }
    ],
    parts: { w: "incredible", list: [["in-", "tidak"], ["cred", "percaya"], ["-ible", "adjective: dapat di-"]] },
    sentence: { text: "Researchers should cite ___ sources such as peer-reviewed journals.", answer: "credible", why: "Sebelum noun (sources) butuh adjective; sumber yang dipakai harus dapat dipercaya." },
    more: [{ text: "The scandal seriously damaged the minister's ___.", answer: "credibility", why: "Setelah kata kepemilikan (minister's) butuh noun." }],
    focus: "credible",
    synonyms: [{ w: "reliable", arti: "dapat diandalkan" }, { w: "trustworthy", arti: "dapat dipercaya" }],
    antonyms: [{ w: "unreliable", arti: "tidak dapat diandalkan" }]
  },
  {
    id: "emit",
    forms: [
      { w: "emit", pos: "verb", arti: "memancarkan / mengeluarkan" },
      { w: "emission", pos: "noun", arti: "emisi / pancaran" }
    ],
    parts: { w: "emission", list: [["e-", "keluar"], ["miss", "mengirim"], ["-ion", "noun: hasil"]] },
    sentence: { text: "Cars that ___ less carbon dioxide are better for the environment.", answer: "emit", why: "Setelah 'that' (kata penghubung) sebagai predikat butuh verb." },
    more: [{ text: "Reducing carbon ___ is a key goal of the climate agreement.", answer: "emission", why: "Setelah verb + ing (reducing) sebagai objek butuh noun." }],
    focus: "emit",
    synonyms: [{ w: "release", arti: "melepaskan" }, { w: "discharge", arti: "mengeluarkan" }],
    antonyms: [{ w: "absorb", arti: "menyerap" }]
  },
  {
    id: "transmit",
    forms: [
      { w: "transmit", pos: "verb", arti: "mengirimkan / menularkan" },
      { w: "transmission", pos: "noun", arti: "transmisi / penularan" }
    ],
    parts: { w: "transmit", list: [["trans-", "melintasi"], ["mit", "mengirim"]] },
    sentence: { text: "Mosquitoes can ___ diseases such as malaria and dengue.", answer: "transmit", why: "Setelah modal (can) butuh verb bentuk dasar." },
    more: [{ text: "Washing hands regularly helps prevent the ___ of the virus.", answer: "transmission", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
    focus: "transmit",
    synonyms: [{ w: "spread", arti: "menyebarkan" }],
    antonyms: [{ w: "receive", arti: "menerima" }]
  },
  {
    id: "produce",
    forms: [
      { w: "produce", pos: "verb", arti: "menghasilkan / memproduksi" },
      { w: "production", pos: "noun", arti: "produksi" },
      { w: "productive", pos: "adjective", arti: "produktif" },
      { w: "productively", pos: "adverb", arti: "secara produktif" }
    ],
    parts: { w: "productive", list: [["pro-", "ke depan"], ["duct", "membawa"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "Working in short, focused sessions made her far more ___.", answer: "productive", why: "Setelah 'more' dalam pola make + objek + ___ butuh adjective." },
    more: [{ text: "The film's ___ cost more than ten million dollars.", answer: "production", why: "Setelah kata kepemilikan (film's) sebagai subjek butuh noun." }],
    focus: "productive",
    synonyms: [{ w: "efficient", arti: "efisien" }],
    antonyms: [{ w: "unproductive", arti: "tidak produktif" }]
  },
  {
    id: "persist",
    forms: [
      { w: "persist", pos: "verb", arti: "bertahan / tetap melakukan" },
      { w: "persistence", pos: "noun", arti: "kegigihan" },
      { w: "persistent", pos: "adjective", arti: "gigih / terus-menerus" },
      { w: "persistently", pos: "adverb", arti: "dengan gigih" }
    ],
    parts: { w: "persistent", list: [["per-", "terus-menerus"], ["sist", "berdiri / tetap"], ["-ent", "adjective: bersifat"]] },
    sentence: { text: "Despite repeated failures, the ___ researcher kept testing new ideas.", answer: "persistent", why: "Di antara 'the' dan noun (researcher) butuh adjective." },
    more: [{ text: "Her ___ finally paid off when the journal accepted her paper.", answer: "persistence", why: "Setelah kata kepemilikan (her) sebagai subjek butuh noun." }],
    focus: "persistent",
    synonyms: [{ w: "determined", arti: "bertekad" }, { w: "tenacious", arti: "gigih / ulet" }],
    antonyms: []
  },
  {
    id: "consequence",
    forms: [
      { w: "consequence", pos: "noun", arti: "akibat / konsekuensi" },
      { w: "consequent", pos: "adjective", arti: "yang menjadi akibat" },
      { w: "consequently", pos: "adverb", arti: "akibatnya / oleh karena itu" }
    ],
    parts: { w: "consequently", list: [["con-", "bersama"], ["sequ", "mengikuti"], ["-ent", "adjective: bersifat"], ["-ly", "adverb: dengan cara"]] },
    sentence: { text: "The main bridge was closed for repairs; ___, traffic in the city center became heavier.", answer: "consequently", why: "Kata penghubung antarkalimat (setelah titik koma, sebelum koma) diisi adverb." },
    more: [{ text: "Students should think about the ___ of their choices before acting.", answer: "consequence", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
    focus: "consequence",
    synonyms: [{ w: "result", arti: "hasil" }, { w: "outcome", arti: "hasil akhir" }],
    antonyms: [{ w: "cause", arti: "penyebab" }]
  },
  {
    id: "evident",
    forms: [
      { w: "evident", pos: "adjective", arti: "jelas / nyata" },
      { w: "evidence", pos: "noun", arti: "bukti" },
      { w: "evidently", pos: "adverb", arti: "rupanya / jelas sekali" }
    ],
    parts: { w: "evident", list: [["e-", "keluar"], ["vid", "melihat"], ["-ent", "adjective: bersifat"]] },
    sentence: { text: "There is strong ___ that regular exercise improves memory.", answer: "evidence", why: "Setelah adjective (strong) butuh noun." },
    more: [{ text: "It was ___ from her expression that she disagreed.", answer: "evident", why: "Setelah to be (was) butuh adjective." }],
    focus: "evident",
    synonyms: [{ w: "obvious", arti: "jelas sekali" }, { w: "apparent", arti: "tampak jelas" }],
    antonyms: [{ w: "obscure", arti: "tidak jelas / samar" }]
  },
  {
    id: "revise",
    forms: [
      { w: "revise", pos: "verb", arti: "merevisi / memperbaiki" },
      { w: "revision", pos: "noun", arti: "revisi" }
    ],
    parts: { w: "revision", list: [["re-", "lagi"], ["vis", "melihat"], ["-ion", "noun: hasil"]] },
    sentence: { text: "Please ___ your essay before submitting the final version.", answer: "revise", why: "Kalimat perintah setelah 'please' butuh verb bentuk dasar." },
    more: [{ text: "The draft needed several rounds of ___ before it was published.", answer: "revision", why: "Setelah 'of' butuh noun." }],
    focus: "revise",
    synonyms: [{ w: "amend", arti: "mengubah / memperbaiki" }, { w: "edit", arti: "menyunting" }],
    antonyms: []
  },
  {
    id: "inevitable",
    forms: [
      { w: "inevitable", pos: "adjective", arti: "tidak terhindarkan" },
      { w: "inevitably", pos: "adverb", arti: "mau tidak mau / pasti" },
      { w: "inevitability", pos: "noun", arti: "keniscayaan" }
    ],
    parts: { w: "inevitable", list: [["in-", "tidak"], ["evit", "menghindari"], ["-able", "adjective: dapat di-"]] },
    sentence: { text: "With prices rising so fast, a change in policy seemed ___.", answer: "inevitable", why: "Setelah linking verb (seemed) butuh adjective." },
    more: [{ text: "Large building projects ___ face some unexpected delays.", answer: "inevitably", why: "Menerangkan verb (face) butuh adverb." }],
    focus: "inevitable",
    synonyms: [{ w: "unavoidable", arti: "tak terelakkan" }],
    antonyms: [{ w: "avoidable", arti: "dapat dihindari" }]
  },
  {
    id: "accurate",
    forms: [
      { w: "accurate", pos: "adjective", arti: "akurat / tepat" },
      { w: "accuracy", pos: "noun", arti: "ketepatan / akurasi" },
      { w: "accurately", pos: "adverb", arti: "secara akurat" },
      { w: "inaccurate", pos: "adjective", arti: "tidak akurat" }
    ],
    parts: { w: "inaccurate", list: [["in-", "tidak"], ["accur", "teliti / cermat"], ["-ate", "pembentuk kata"]] },
    sentence: { text: "The new scale measures weight ___ to the nearest gram.", answer: "accurately", why: "Menerangkan verb (measures) butuh adverb." },
    more: [{ text: "Reporters must check the ___ of every number they publish.", answer: "accuracy", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
    focus: "accurate",
    synonyms: [{ w: "precise", arti: "tepat / persis" }, { w: "exact", arti: "tepat" }],
    antonyms: [{ w: "imprecise", arti: "tidak tepat" }]
  },
  {
    id: "beneficial",
    forms: [
      { w: "benefit", pos: "noun", arti: "manfaat" },
      { w: "beneficial", pos: "adjective", arti: "bermanfaat" },
      { w: "beneficiary", pos: "noun", arti: "penerima manfaat" }
    ],
    parts: { w: "beneficial", list: [["bene", "baik"], ["fic", "membuat"], ["-ial", "adjective: berkaitan dengan"]] },
    sentence: { text: "Regular exercise is ___ for both body and mind.", answer: "beneficial", why: "Setelah to be (is) butuh adjective." },
    more: [{ text: "Every ___ of the scholarship must submit a progress report each semester.", answer: "beneficiary", why: "Setelah 'every' butuh noun; yang menyerahkan laporan adalah orangnya (penerima)." }],
    focus: "beneficial",
    synonyms: [{ w: "advantageous", arti: "menguntungkan" }],
    antonyms: [{ w: "harmful", arti: "merugikan / berbahaya" }]
  },
  {
    id: "nutrition",
    forms: [
      { w: "nutrition", pos: "noun", arti: "gizi / nutrisi" },
      { w: "nutritious", pos: "adjective", arti: "bergizi" },
      { w: "malnutrition", pos: "noun", arti: "kekurangan gizi / gizi buruk" }
    ],
    parts: { w: "malnutrition", list: [["mal", "buruk"], ["nutri", "memberi makan"], ["-tion", "noun: keadaan"]] },
    sentence: { text: "Children who lack food for long periods may suffer from ___.", answer: "malnutrition", why: "Setelah 'suffer from' butuh noun; kekurangan makanan menyebabkan gizi buruk." },
    more: [{ text: "A ___ breakfast helps students concentrate in class.", answer: "nutritious", why: "Di antara 'a' dan noun (breakfast) butuh adjective." }],
    focus: "nutritious",
    synonyms: [{ w: "wholesome", arti: "menyehatkan" }],
    antonyms: [{ w: "unhealthy", arti: "tidak sehat" }]
  },
  {
    id: "audible",
    forms: [
      { w: "audible", pos: "adjective", arti: "dapat didengar" },
      { w: "inaudible", pos: "adjective", arti: "tidak terdengar" },
      { w: "audience", pos: "noun", arti: "penonton / pendengar" }
    ],
    parts: { w: "inaudible", list: [["in-", "tidak"], ["aud", "mendengar"], ["-ible", "adjective: dapat di-"]] },
    sentence: { text: "The speaker's voice was barely ___ over the noise of the crowd.", answer: "audible", why: "'barely' = hampir tidak; jadi suaranya hampir tidak dapat didengar (audible)." },
    more: [{ text: "The ___ applauded loudly at the end of the performance.", answer: "audience", why: "Setelah 'the' sebagai subjek butuh noun." }],
    focus: "audible",
    synonyms: [{ w: "perceptible", arti: "dapat ditangkap indra" }],
    antonyms: [{ w: "silent", arti: "tanpa suara" }]
  },
  {
    id: "describe",
    forms: [
      { w: "describe", pos: "verb", arti: "menggambarkan / mendeskripsikan" },
      { w: "description", pos: "noun", arti: "deskripsi / gambaran" },
      { w: "descriptive", pos: "adjective", arti: "bersifat menggambarkan" }
    ],
    parts: { w: "descriptive", list: [["de-", "menurunkan"], ["script", "menulis"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "Can you ___ the man you saw near the library?", answer: "describe", why: "Setelah 'can you' butuh verb bentuk dasar." },
    more: [{ text: "The novel opens with a long ___ of an old fishing village.", answer: "description", why: "Setelah 'a long' (artikel + adjective) butuh noun." }],
    focus: "describe",
    synonyms: [{ w: "depict", arti: "menggambarkan" }, { w: "portray", arti: "melukiskan" }],
    antonyms: []
  },
  {
    id: "reverse",
    forms: [
      { w: "reverse", pos: "verb", arti: "membalikkan / membatalkan" },
      { w: "reversal", pos: "noun", arti: "pembalikan" },
      { w: "reversible", pos: "adjective", arti: "dapat dibalik / dipulihkan" },
      { w: "irreversible", pos: "adjective", arti: "tidak dapat dipulihkan" }
    ],
    parts: { w: "irreversible", list: [["ir-", "tidak"], ["vers", "berbalik"], ["-ible", "adjective: dapat di-"]] },
    sentence: { text: "Some damage to coral reefs is ___ and can never be repaired.", answer: "irreversible", why: "Setelah to be (is) butuh adjective; 'can never be repaired' menunjukkan tidak dapat dipulihkan." },
    more: [{ text: "The court decided to ___ its earlier decision.", answer: "reverse", why: "Setelah 'to' butuh verb bentuk dasar." }],
    focus: "irreversible",
    synonyms: [{ w: "permanent", arti: "permanen / tetap" }],
    antonyms: [{ w: "temporary", arti: "sementara" }]
  },
  {
    id: "provoke",
    forms: [
      { w: "provoke", pos: "verb", arti: "memancing / memprovokasi" },
      { w: "provocation", pos: "noun", arti: "provokasi" },
      { w: "provocative", pos: "adjective", arti: "provokatif / memancing reaksi" }
    ],
    parts: { w: "provocative", list: [["pro-", "ke depan"], ["voc", "memanggil"], ["-ive", "adjective: bersifat"]] },
    sentence: { text: "The writer's ___ comments started a heated debate online.", answer: "provocative", why: "Sebelum noun (comments) butuh adjective." },
    more: [{ text: "Do not let rude comments ___ you into an argument.", answer: "provoke", why: "Pola 'let + objek + ___' diisi verb bentuk dasar." }],
    focus: "provoke",
    synonyms: [{ w: "trigger", arti: "memicu" }, { w: "incite", arti: "menghasut" }],
    antonyms: [{ w: "pacify", arti: "menenangkan" }]
  },
  {
    id: "motivate",
    forms: [
      { w: "motivate", pos: "verb", arti: "memotivasi" },
      { w: "motivation", pos: "noun", arti: "motivasi" },
      { w: "motive", pos: "noun", arti: "motif / alasan di balik tindakan" }
    ],
    parts: { w: "motivate", list: [["mot", "bergerak"], ["-ive", "adjective: bersifat"], ["-ate", "verb: membuat"]] },
    sentence: { text: "Good teachers know how to ___ students who have lost interest.", answer: "motivate", why: "Setelah 'how to' butuh verb bentuk dasar." },
    more: [{ text: "Her strong ___ to study medicine came from caring for her sick grandmother.", answer: "motivation", why: "Setelah adjective (strong) butuh noun; 'motivation to + verb' = dorongan untuk melakukan sesuatu." }],
    focus: "motivate",
    synonyms: [{ w: "encourage", arti: "mendorong / menyemangati" }, { w: "inspire", arti: "menginspirasi" }],
    antonyms: [{ w: "discourage", arti: "mematahkan semangat" }]
  },
  {
    id: "suspend",
    forms: [
      { w: "suspend", pos: "verb", arti: "menangguhkan / menghentikan sementara" },
      { w: "suspension", pos: "noun", arti: "penangguhan" },
      { w: "suspense", pos: "noun", arti: "ketegangan (menunggu kelanjutan)" }
    ],
    parts: { w: "suspension", list: [["sus-", "di bawah"], ["pens", "menggantung"], ["-ion", "noun: hasil"]] },
    sentence: { text: "The school decided to ___ classes because of the flood.", answer: "suspend", why: "Setelah 'to' butuh verb bentuk dasar." },
    more: [{ text: "The film kept the audience in ___ until the very last scene.", answer: "suspense", why: "'in suspense' = dalam ketegangan; setelah preposisi (in) butuh noun." }],
    focus: "suspend",
    synonyms: [{ w: "postpone", arti: "menunda" }, { w: "halt", arti: "menghentikan" }],
    antonyms: [{ w: "resume", arti: "melanjutkan kembali" }]
  },
  {
    id: "fluent",
    forms: [
      { w: "fluent", pos: "adjective", arti: "fasih / lancar" },
      { w: "fluency", pos: "noun", arti: "kefasihan / kelancaran" },
      { w: "fluently", pos: "adverb", arti: "dengan fasih" }
    ],
    parts: { w: "fluently", list: [["flu", "mengalir"], ["-ent", "adjective: bersifat"], ["-ly", "adverb: dengan cara"]] },
    sentence: { text: "After two years in Japan, she can speak Japanese ___.", answer: "fluently", why: "Menerangkan verb (speak) butuh adverb." },
    more: [{ text: "Reading aloud every day can improve your ___.", answer: "fluency", why: "Setelah kata kepemilikan (your) sebagai objek butuh noun." }],
    focus: "fluent",
    synonyms: [{ w: "articulate", arti: "pandai mengungkapkan" }],
    antonyms: [{ w: "hesitant", arti: "tersendat / ragu-ragu" }]
  },
  {
    id: "obstruct",
    forms: [
      { w: "obstruct", pos: "verb", arti: "menghalangi" },
      { w: "obstruction", pos: "noun", arti: "halangan / sumbatan" }
    ],
    parts: { w: "obstruction", list: [["ob-", "menghalangi"], ["struct", "membangun"], ["-ion", "noun: hasil"]] },
    sentence: { text: "Parked cars must not ___ the emergency exit.", answer: "obstruct", why: "Setelah 'must not' butuh verb bentuk dasar." },
    more: [{ text: "The doctor removed an ___ from the patient's airway.", answer: "obstruction", why: "Setelah 'an' butuh noun." }],
    focus: "obstruct",
    synonyms: [{ w: "block", arti: "menghalangi" }, { w: "hinder", arti: "menghambat" }],
    antonyms: [{ w: "facilitate", arti: "memudahkan / memperlancar" }]
  },
  {
    id: "explicit",
    forms: [
      { w: "explicit", pos: "adjective", arti: "eksplisit / tersurat" },
      { w: "explicitly", pos: "adverb", arti: "secara tersurat / terang-terangan" },
      { w: "implicit", pos: "adjective", arti: "tersirat" }
    ],
    parts: { w: "explicit", list: [["ex-", "keluar"], ["plic", "melipat"], ["-it", "pembentuk kata"]] },
    sentence: { text: "The rules state ___ that phones must be switched off during the exam.", answer: "explicitly", why: "Menerangkan verb (state) butuh adverb." },
    more: [{ text: "The author never says it directly; the message is ___ in the story.", answer: "implicit", why: "'never says it directly' menunjukkan pesannya tersirat; setelah to be (is) butuh adjective." }],
    focus: "explicit",
    synonyms: [{ w: "direct", arti: "langsung / terus terang" }],
    antonyms: [{ w: "vague", arti: "samar" }]
  },
  {
    id: "comprehend",
    forms: [
      { w: "comprehend", pos: "verb", arti: "memahami" },
      { w: "comprehension", pos: "noun", arti: "pemahaman" },
      { w: "comprehensive", pos: "adjective", arti: "menyeluruh / lengkap" },
      { w: "comprehensible", pos: "adjective", arti: "dapat dipahami" }
    ],
    parts: { w: "comprehensible", list: [["com-", "sepenuhnya"], ["prehens", "menangkap / memegang"], ["-ible", "adjective: dapat di-"]] },
    sentence: { text: "The report gives a ___ overview of every school in the province, from budgets to exam results.", answer: "comprehensive", why: "Sebelum noun (overview) butuh adjective; 'every school… from budgets to exam results' menunjukkan menyeluruh. Hati-hati: comprehensible = dapat dipahami." },
    more: [{ text: "Reading ___ is one of the sections tested in the English exam.", answer: "comprehension", why: "'reading comprehension' = pemahaman bacaan; posisi inti frasa noun butuh noun." }],
    focus: "comprehend",
    synonyms: [{ w: "understand", arti: "memahami" }, { w: "grasp", arti: "menangkap maksud" }],
    antonyms: [{ w: "misunderstand", arti: "salah paham" }]
  },
  {
    id: "assume",
    forms: [
      { w: "assume", pos: "verb", arti: "mengasumsikan / menganggap" },
      { w: "assumption", pos: "noun", arti: "asumsi / anggapan" }
    ],
    parts: { w: "assumption", list: [["as-", "ke arah"], ["sumpt", "mengambil"], ["-ion", "noun: hasil"]] },
    sentence: { text: "Don't ___ that everyone shares your opinion.", answer: "assume", why: "Kalimat larangan setelah 'don't' butuh verb bentuk dasar." },
    more: [{ text: "The whole argument rests on the ___ that people always act rationally.", answer: "assumption", why: "Setelah 'the' dan sebelum 'that' (keterangan isi) butuh noun." }],
    focus: "assume",
    synonyms: [{ w: "presume", arti: "menduga" }, { w: "suppose", arti: "mengira" }],
    antonyms: []
  },
  {
    id: "significant",
    forms: [
      { w: "signify", pos: "verb", arti: "menandakan" },
      { w: "significance", pos: "noun", arti: "arti penting / makna" },
      { w: "significant", pos: "adjective", arti: "penting / signifikan" },
      { w: "significantly", pos: "adverb", arti: "secara signifikan" }
    ],
    parts: { w: "significant", list: [["sign", "tanda"], ["-ific", "membuat"], ["-ant", "adjective: bersifat"]] },
    sentence: { text: "The new medicine ___ reduced the number of hospital visits.", answer: "significantly", why: "Di antara subjek dan verb (reduced), menerangkan verb, butuh adverb." },
    more: [{ text: "Historians still debate the ___ of the treaty.", answer: "significance", why: "Setelah 'the' dan sebelum 'of' butuh noun." }],
    focus: "significant",
    synonyms: [{ w: "important", arti: "penting" }, { w: "considerable", arti: "cukup besar" }],
    antonyms: [{ w: "trivial", arti: "remeh / sepele" }]
  },
  {
    id: "analyze",
    forms: [
      { w: "analyze", pos: "verb", arti: "menganalisis" },
      { w: "analysis", pos: "noun", arti: "analisis" },
      { w: "analytical", pos: "adjective", arti: "analitis" },
      { w: "analyst", pos: "noun", arti: "analis (orangnya)" }
    ],
    parts: { w: "analytical", list: [["analyt", "mengurai"], ["-ical", "adjective: berkaitan dengan"]] },
    sentence: { text: "The team will ___ the survey data next week.", answer: "analyze", why: "Setelah modal (will) butuh verb bentuk dasar." },
    more: [{ text: "Strong ___ skills help students solve unfamiliar problems.", answer: "analytical", why: "Sebelum noun (skills) butuh adjective." }],
    focus: "analyze",
    synonyms: [{ w: "examine", arti: "memeriksa / menelaah" }, { w: "evaluate", arti: "menilai" }],
    antonyms: []
  },
  {
    id: "compel",
    forms: [
      { w: "compel", pos: "verb", arti: "memaksa" },
      { w: "compulsory", pos: "adjective", arti: "wajib" },
      { w: "compulsion", pos: "noun", arti: "paksaan / dorongan kuat" }
    ],
    parts: { w: "compulsory", list: [["com-", "sepenuhnya"], ["puls", "mendorong"], ["-ory", "adjective: bersifat"]] },
    sentence: { text: "Wearing a helmet is ___ for all motorcycle riders.", answer: "compulsory", why: "Setelah to be (is) butuh adjective." },
    more: [{ text: "Rising costs may ___ some students to work part-time.", answer: "compel", why: "Setelah modal (may) butuh verb bentuk dasar." }],
    focus: "compulsory",
    synonyms: [{ w: "mandatory", arti: "wajib" }, { w: "obligatory", arti: "diharuskan" }],
    antonyms: [{ w: "optional", arti: "pilihan / tidak wajib" }]
  },
  {
    id: "consume",
    forms: [
      { w: "consume", pos: "verb", arti: "mengonsumsi / menghabiskan" },
      { w: "consumption", pos: "noun", arti: "konsumsi" },
      { w: "consumer", pos: "noun", arti: "konsumen" }
    ],
    parts: { w: "consumption", list: [["con-", "sepenuhnya"], ["sumpt", "mengambil"], ["-ion", "noun: hasil"]] },
    sentence: { text: "Old air conditioners ___ a lot of electricity.", answer: "consume", why: "Setelah subjek jamak (air conditioners) sebagai predikat butuh verb." },
    more: [{ text: "Sugar ___ has risen sharply among teenagers.", answer: "consumption", why: "Subjek sebelum 'has risen' butuh noun; yang naik adalah jumlah konsumsinya, bukan orangnya." }],
    focus: "consume",
    synonyms: [{ w: "expend", arti: "menghabiskan / memakai" }],
    antonyms: [{ w: "conserve", arti: "menghemat / melestarikan" }]
  },
  {
    id: "tolerate",
    forms: [
      { w: "tolerate", pos: "verb", arti: "menoleransi / menahan" },
      { w: "tolerance", pos: "noun", arti: "toleransi" },
      { w: "tolerant", pos: "adjective", arti: "toleran" },
      { w: "intolerable", pos: "adjective", arti: "tak tertahankan" }
    ],
    parts: { w: "intolerable", list: [["in-", "tidak"], ["toler", "menanggung"], ["-able", "adjective: dapat di-"]] },
    sentence: { text: "The heat in the classroom became almost ___ by noon.", answer: "intolerable", why: "Setelah linking verb (became) butuh adjective; 'almost ___' tentang panas yang hampir tak tertahankan." },
    more: [{ text: "A ___ society respects people with different beliefs.", answer: "tolerant", why: "Di antara 'a' dan noun (society) butuh adjective." }],
    focus: "tolerant",
    synonyms: [{ w: "open-minded", arti: "berpikiran terbuka" }],
    antonyms: [{ w: "narrow-minded", arti: "berpikiran sempit" }]
  },
  {
    id: "vary",
    forms: [
      { w: "vary", pos: "verb", arti: "bervariasi / berbeda-beda" },
      { w: "variation", pos: "noun", arti: "variasi" },
      { w: "various", pos: "adjective", arti: "beragam / berbagai" }
    ],
    parts: { w: "various", list: [["vari", "berubah"], ["-ous", "adjective: bersifat"]] },
    sentence: { text: "Prices ___ from one city to another.", answer: "vary", why: "Setelah subjek jamak (prices) sebagai predikat butuh verb." },
    more: [{ text: "The museum displays ___ objects from across Southeast Asia.", answer: "various", why: "Sebelum noun (objects) butuh adjective." }],
    focus: "various",
    synonyms: [{ w: "diverse", arti: "beragam" }],
    antonyms: [{ w: "uniform", arti: "seragam" }]
  },
  {
    id: "hesitate",
    forms: [
      { w: "hesitate", pos: "verb", arti: "ragu-ragu" },
      { w: "hesitation", pos: "noun", arti: "keraguan" },
      { w: "hesitant", pos: "adjective", arti: "ragu" },
      { w: "hesitantly", pos: "adverb", arti: "dengan ragu" }
    ],
    parts: { w: "hesitant", list: [["hesit", "tertahan / ragu"], ["-ant", "adjective: bersifat"]] },
    sentence: { text: "Don't ___ to ask questions if anything is unclear.", answer: "hesitate", why: "Setelah 'don't' butuh verb bentuk dasar." },
    more: [{ text: "After a moment of ___, he raised his hand.", answer: "hesitation", why: "Setelah 'of' butuh noun." }],
    focus: "hesitant",
    synonyms: [{ w: "uncertain", arti: "tidak yakin" }, { w: "doubtful", arti: "ragu" }],
    antonyms: [{ w: "confident", arti: "yakin / percaya diri" }]
  },
  {
    id: "inspect",
    forms: [
      { w: "inspect", pos: "verb", arti: "memeriksa" },
      { w: "inspection", pos: "noun", arti: "pemeriksaan / inspeksi" },
      { w: "inspector", pos: "noun", arti: "pemeriksa / inspektur" }
    ],
    parts: { w: "inspector", list: [["in-", "ke dalam"], ["spect", "melihat"], ["-or", "noun: pelaku"]] },
    sentence: { text: "Officials will ___ the building before it opens to the public.", answer: "inspect", why: "Setelah modal (will) butuh verb bentuk dasar." },
    more: [{ text: "The restaurant failed its hygiene ___ last month.", answer: "inspection", why: "Yang gagal dilewati adalah pemeriksaannya; posisi inti frasa noun butuh noun (bukan orangnya)." }],
    focus: "inspect",
    synonyms: [{ w: "examine", arti: "memeriksa" }, { w: "scrutinize", arti: "meneliti dengan cermat" }],
    antonyms: [{ w: "overlook", arti: "mengabaikan / tidak memperhatikan" }]
  }
];
