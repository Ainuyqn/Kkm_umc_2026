// ============ APP.JS (index.html & daftar-umkm.html) ============
let allUmkm = [];

// Load data JSON
async function loadUmkm() {
  try {
    const res = await fetch('data/umkm.json');
    allUmkm = await res.json();
    return allUmkm;
  } catch (err) {
    console.error('Gagal load data:', err);
    return [];
  }
}

// Format harga ke Rupiah
function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// Render card UMKM
function renderCard(umkm) {
  return `
    <div class="umkm-card" onclick="goToDetail('${umkm.id}')">
      <img src="${umkm.foto}" alt="${umkm.nama}" class="umkm-card-img" onerror="this.src='https://via.placeholder.com/400x200?text=UMKM'">
      <div class="umkm-card-body">
        <span class="kategori-badge">${umkm.kategori}</span>
        <h3>${umkm.nama}</h3>
        <p class="owner">👤 ${umkm.pemilik}</p>
        <p class="desc">${umkm.deskripsi}</p>
      </div>
    </div>
  `;
}

// Navigasi ke detail
function goToDetail(id) {
  window.location.href = `detail-umkm.html?id=${id}`;
}

// ============ HALAMAN INDEX ============
async function initIndex() {
  const umkm = await loadUmkm();
  if (!umkm.length) return;

  // Hitung kategori
  const kategoriCount = {};
  umkm.forEach(u => {
    kategoriCount[u.kategori] = (kategoriCount[u.kategori] || 0) + 1;
  });

  const kategoriIcons = {
    'Makanan': '🍜',
    'Minuman': '🥤',
    'Jasa': '🛠️',
    'Pertanian': '🌾'
  };

  // Render kategori
  const kategoriGrid = document.getElementById('kategoriGrid');
  if (kategoriGrid) {
    kategoriGrid.innerHTML = Object.entries(kategoriCount).map(([kat, count]) => `
      <div class="kategori-card" onclick="filterByKategori('${kat}')">
        <div class="kategori-icon">${kategoriIcons[kat] || '📦'}</div>
        <h3>${kat}</h3>
        <span>${count} UMKM</span>
      </div>
    `).join('');
  }

  // Render UMKM unggulan (max 6)
  const unggulanGrid = document.getElementById('unggulanGrid');
  if (unggulanGrid) {
    unggulanGrid.innerHTML = umkm.slice(0, 6).map(renderCard).join('');
  }
}

function filterByKategori(kat) {
  window.location.href = `daftar-umkm.html?kategori=${encodeURIComponent(kat)}`;
}

// ============ HALAMAN DAFTAR UMKM ============
async function initDaftar() {
  const umkm = await loadUmkm();
  if (!umkm.length) return;

  const searchInput = document.getElementById('searchInput');
  const kategoriSelect = document.getElementById('kategoriSelect');
  const grid = document.getElementById('umkmGrid');

  // Ambil kategori unik
  const kategoriSet = [...new Set(umkm.map(u => u.kategori))];
  kategoriSelect.innerHTML = '<option value="">Semua Kategori</option>' +
    kategoriSet.map(k => `<option value="${k}">${k}</option>`).join('');

  // Cek URL params
  const params = new URLSearchParams(window.location.search);
  const initialKat = params.get('kategori');
  if (initialKat) kategoriSelect.value = initialKat;

  function render() {
    const keyword = searchInput.value.toLowerCase();
    const kategori = kategoriSelect.value;

    const filtered = umkm.filter(u => {
      const matchKeyword = u.nama.toLowerCase().includes(keyword) ||
                           u.pemilik.toLowerCase().includes(keyword) ||
                           u.deskripsi.toLowerCase().includes(keyword);
      const matchKategori = !kategori || u.kategori === kategori;
      return matchKeyword && matchKategori;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="icon">🔍</div>
          <h3>UMKM tidak ditemukan</h3>
          <p>Coba kata kunci atau kategori lain</p>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(renderCard).join('');
    }
  }

  searchInput.addEventListener('input', render);
  kategoriSelect.addEventListener('change', render);
  render();
}

// ============ HERO SEARCH (index.html) ============
function initHeroSearch() {
  const heroSearch = document.getElementById('heroSearch');
  const heroInput = document.getElementById('heroInput');
  if (!heroSearch) return;

  heroSearch.addEventListener('click', () => {
    const q = heroInput.value.trim();
    if (q) {
      window.location.href = `daftar-umkm.html?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = 'daftar-umkm.html';
    }
  });
  heroInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') heroSearch.click();
  });
}

// ============ MOBILE MENU ============
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('show'));
  }
}

// ============ AUTO INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeroSearch();
  if (document.getElementById('unggulanGrid')) initIndex();
  if (document.getElementById('umkmGrid')) initDaftar();
});
