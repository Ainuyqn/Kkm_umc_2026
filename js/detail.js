// ============ DETAIL.JS (detail-umkm.html) ============
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('detailContent').innerHTML = `
      <div class="empty-state">
        <div class="icon">❌</div>
        <h3>UMKM tidak ditemukan</h3>
        <a href="daftar-umkm.html" class="back-btn">← Kembali ke daftar</a>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch('data/umkm.json');
    const umkmList = await res.json();
    const umkm = umkmList.find(u => u.id === id);

    if (!umkm) {
      document.getElementById('detailContent').innerHTML = `
        <div class="empty-state">
          <div class="icon">❌</div>
          <h3>UMKM tidak ditemukan</h3>
          <a href="daftar-umkm.html" class="back-btn">← Kembali ke daftar</a>
        </div>
      `;
      return;
    }

    // Update title
    document.title = `${umkm.nama} - Katalog UMKM Jagapura Lor`;

    // Render detail
    document.getElementById('detailContent').innerHTML = `
      <a href="daftar-umkm.html" class="back-btn">← Kembali ke daftar</a>

      <div class="detail-card">
        <img src="${umkm.foto}" alt="${umkm.nama}" class="detail-img" onerror="this.src='https://via.placeholder.com/600x400?text=UMKM'">
        <div class="detail-info">
          <span class="kategori-badge">${umkm.kategori}</span>
          <h1>${umkm.nama}</h1>
          <p class="owner">👤 ${umkm.pemilik}</p>

          <div class="info-item">
            <span class="icon">📍</span>
            <div><strong>Alamat</strong><br>${umkm.alamat}</div>
          </div>

          <div class="info-item">
            <span class="icon">📞</span>
            <div><strong>Kontak</strong><br>WhatsApp: ${umkm.whatsapp.replace('62','0')}</div>
          </div>

          <div class="detail-desc">
            <strong>Deskripsi:</strong>
            <p>${umkm.deskripsi}</p>
          </div>

          <a href="https://wa.me/${umkm.whatsapp}" target="_blank" class="wa-btn">
            💬 Hubungi via WhatsApp
          </a>
        </div>
      </div>

      <div class="produk-section">
        <h2>📦 Produk & Layanan</h2>
        <div class="produk-grid">
          ${umkm.produk.map(p => `
            <div class="produk-card">
              <img src="${p.foto}" alt="${p.nama}" onerror="this.src='https://via.placeholder.com/300x200?text=Produk'">
              <div class="produk-card-body">
                <h4>${p.nama}</h4>
                <p class="harga">${formatRupiah(p.harga)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    function formatRupiah(angka) {
      return 'Rp ' + angka.toLocaleString('id-ID');
    }

  } catch (err) {
    console.error(err);
    document.getElementById('detailContent').innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <h3>Gagal memuat data</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
});
