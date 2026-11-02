# Vocab Lab

Latihan membaca kata bahasa Inggris yang terlihat asing lewat prefix, root, dan suffix.

## Isi folder
- `index.html` — tampilan
- `app.js` — logika soal (tidak perlu diubah untuk menambah kata)
- `data.js` — daftar imbuhan dan keluarga kata

## Jenis soal
- **Jenis kata**: "Which is a noun?"
- **Isi kalimat**: pilih bentuk kata yang tepat (deceive / deception / deceptive)
- **Imbuhan**: arti prefix/root, atau jenis kata dari suffix
- **Pecah kata**: tebak arti dari bagian-bagian kata
- **Sinonim & antonim**: di mode Campur baru muncul setelah sebuah kata dijawab benar 3 kali

Soal yang sering salah otomatis muncul lebih sering. Progres tersimpan di browser.

## Upload ke GitHub Pages
1. Buat repository baru di GitHub (misalnya `vocab-lab`).
2. Upload ketiga file (`index.html`, `app.js`, `data.js`).
3. Buka **Settings → Pages**, pilih branch `main` dan folder `/ (root)`, lalu Save.
4. Tunggu 1–2 menit, situsnya ada di `https://<username>.github.io/vocab-lab/`.

Bisa juga langsung dibuka dengan klik dua kali `index.html` di komputer.

## Menambah kata baru
Salin satu blok di `FAMILIES` (di `data.js`), lalu isi:

```js
{
  id: "benefit",
  forms: [
    { w: "benefit", pos: "verb", arti: "menguntungkan" },
    { w: "beneficial", pos: "adjective", arti: "bermanfaat" },
    { w: "beneficiary", pos: "noun", arti: "penerima manfaat" }
  ],
  parts: { w: "beneficial", list: [["bene", "baik"], ["fic", "membuat"], ["-ial", "adjective"]] },
  sentence: { text: "Regular exercise is ___ for both body and mind.", answer: "beneficial", why: "Setelah to be (is) butuh adjective." },
  focus: "beneficial",
  synonyms: [{ w: "helpful", arti: "membantu" }],
  antonyms: [{ w: "harmful", arti: "merugikan" }]
}
```

Aturan:
- `pos` hanya `noun`, `verb`, `adjective`, atau `adverb`.
- `sentence.answer`, `parts.w`, dan `focus` harus ada di `forms`.
- `antonyms` boleh kosong `[]` kalau tidak ada lawan kata yang jelas.
- Tulis `___` (tiga garis bawah) di kalimat sebagai tempat kosong.
