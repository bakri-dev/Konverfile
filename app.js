/* ============================================================
   KONVERFILE — app.js
   Konversi gambar (JPG/PNG/WebP) & gambar ke PDF
   Semua proses terjadi di browser, tanpa upload ke server.
   ============================================================ */

'use strict';

const $ = s => document.querySelector(s);
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fileSize = b => b >= 1048576 ? (b/1048576).toFixed(1)+' MB' : Math.max(1,Math.round(b/1024))+' KB';

let mode = 'convert';
let files = [];

/* ---- DARK MODE ---- */
(function initTheme() {
  const saved = localStorage.getItem('kf-theme');
  const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (preferDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();

$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('kf-theme', next);
});

/* ---- UTILS ---- */
function say(text, isErr = false) {
  const el = $('#msg');
  el.textContent = text;
  el.className = isErr ? 'err' : '';
}

function renderFileList() {
  const ul = $('#file-list');
  ul.innerHTML = files.map((f, i) => `
    <li>
      <span title="${esc(f.name)}">${esc(f.name)}</span>
      <small>${fileSize(f.size)}</small>
      <button class="btn-del" data-i="${i}" aria-label="Hapus ${esc(f.name)}" title="Hapus">×</button>
    </li>`).join('');
  $('#go').disabled = !files.length;
  $('#clear').disabled = !files.length;
  $('#go').textContent = mode === 'pdf' ? 'Buat PDF' : 'Ubah file';
}

function addFiles(list) {
  const valid = [...list].filter(f => f.type.startsWith('image/'));
  const skipped = list.length - valid.length;
  if (skipped > 0) say(`${skipped} file dilewati karena bukan gambar.`, true);
  else say('');
  files.push(...valid);
  renderFileList();
}

/* ---- LOAD IMAGE ---- */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Gagal memuat: ${file.name}`)); };
    img.src = url;
  });
}

/* ---- DRAW TO CANVAS ---- */
function drawCanvas(img, w, h, whiteBg) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (whiteBg) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/* ---- CONVERT SATU FILE ---- */
async function convertOne(file, type, quality, maxWidth) {
  const { img, url } = await loadImage(file);
  let w = img.naturalWidth, h = img.naturalHeight;
  if (maxWidth && w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
  const canvas = drawCanvas(img, w, h, type === 'image/jpeg');
  URL.revokeObjectURL(url);
  return new Promise(res => canvas.toBlob(res, type, quality));
}

/* ---- BUAT PDF ---- */
async function buildPdf() {
  if (typeof window.jspdf === 'undefined') {
    throw new Error('Library PDF belum termuat. Periksa koneksi internet lalu muat ulang halaman.');
  }
  const { jsPDF } = window.jspdf;
  const fitPage = $('#pg').value === 'fit';
  let doc = null;

  for (const file of files) {
    const { img, url } = await loadImage(file);
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const dataUrl = drawCanvas(img, iw, ih, true).toDataURL('image/jpeg', 0.9);
    URL.revokeObjectURL(url);

    const isLandscape = iw > ih;
    const pw = fitPage ? iw * 0.2646 : (isLandscape ? 297 : 210);
    const ph = fitPage ? ih * 0.2646 : (isLandscape ? 210 : 297);
    const orient = pw > ph ? 'l' : 'p';

    if (!doc) doc = new jsPDF({ orientation: orient, unit: 'mm', format: [pw, ph] });
    else doc.addPage([pw, ph], orient);

    const margin = fitPage ? 0 : 10;
    const scale = Math.min((pw - 2*margin)/iw, (ph - 2*margin)/ih);
    const x = (pw - iw*scale)/2, y = (ph - ih*scale)/2;
    doc.addImage(dataUrl, 'JPEG', x, y, iw*scale, ih*scale);
  }
  return doc.output('blob');
}

/* ---- ROW HASIL ---- */
function resultRow(name, origSize, blob) {
  const url = URL.createObjectURL(blob);
  const sizeInfo = origSize ? `${fileSize(origSize)} → ${fileSize(blob.size)}` : fileSize(blob.size);
  return `<li>
    <span title="${esc(name)}">${esc(name)}</span>
    <small>${sizeInfo}</small>
    <a href="${url}" download="${esc(name)}">Unduh</a>
  </li>`;
}

/* ---- TOMBOL UBAH ---- */
$('#go').addEventListener('click', async () => {
  $('#go').disabled = true;
  $('#out').innerHTML = '';
  say('Memproses…');

  try {
    if (mode === 'pdf') {
      const blob = await buildPdf();
      $('#out').innerHTML = resultRow('konverfile.pdf', 0, blob);
    } else {
      const type = $('#fmt').value;
      const quality = $('#q').value / 100;
      const maxWidth = parseInt($('#mw').value) || 0;
      let html = '';
      for (const file of files) {
        const blob = await convertOne(file, type, quality, maxWidth);
        const newName = file.name.replace(/\.[^.]+$/, '') + '.' + EXT[type];
        html += resultRow(newName, file.size, blob);
      }
      $('#out').innerHTML = html;
    }
    say('Selesai. File tersimpan di perangkatmu — tidak dikirim ke mana pun.');
  } catch (err) {
    say(err.message, true);
  }

  $('#go').disabled = !files.length;
});

/* ---- TOMBOL HAPUS SEMUA ---- */
$('#clear').addEventListener('click', () => {
  files = [];
  $('#out').innerHTML = '';
  $('#file-list').innerHTML = '';
  say('');
  renderFileList();
});

/* ---- HAPUS SATU FILE ---- */
$('#file-list').addEventListener('click', e => {
  const btn = e.target.closest('.btn-del');
  if (!btn) return;
  files.splice(+btn.dataset.i, 1);
  renderFileList();
});

/* ---- INPUT FILE ---- */
$('#file-input').addEventListener('change', e => {
  addFiles(e.target.files);
  e.target.value = '';
});

/* ---- SLIDER KUALITAS ---- */
$('#q').addEventListener('input', e => { $('#qv').textContent = e.target.value + '%' });

/* ---- DRAG & DROP ---- */
const dropEl = $('#drop');
['dragover', 'dragenter'].forEach(ev => dropEl.addEventListener(ev, e => { e.preventDefault(); dropEl.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => dropEl.addEventListener(ev, e => { e.preventDefault(); dropEl.classList.remove('over'); }));
dropEl.addEventListener('drop', e => addFiles(e.dataTransfer.files));

/* ---- TABS ---- */
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b === btn));
    $('#optConvert').hidden = mode !== 'convert';
    $('#optPdf').hidden = mode !== 'pdf';
    $('#out').innerHTML = '';
    say('');
    renderFileList();
  });
});

/* ---- INIT ---- */
renderFileList();
