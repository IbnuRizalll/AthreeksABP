<template>
  <div class="admin-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks Admin</div>

      <div class="nav-links">
        <button class="secondary-btn" @click="logout">Logout</button>
      </div>
    </header>

    <main class="shell-content admin-content">
      <section class="surface-card admin-hero">
        <div class="hero-copy">
          <span class="section-eyebrow">Dashboard Admin</span>
          <h1 class="section-title">Kelola operasional Athreeks dari satu dashboard.</h1>
          <p class="section-copy">
            Akses pengelolaan produk, pesanan, dan riwayat penjualan dalam satu tempat.
          </p>
        </div>

        <div class="stat-grid">
          <article class="soft-card stat-card">
            <p class="stat-label">Area kerja</p>
            <p class="stat-value">3 Modul Utama</p>
          </article>
          <article class="soft-card stat-card">
            <p class="stat-label">Akses cepat</p>
            <p class="stat-value">Produk & Pesanan</p>
          </article>
          <article class="soft-card stat-card">
            <p class="stat-label">Monitoring</p>
            <p class="stat-value">Riwayat Penjualan</p>
          </article>
        </div>
      </section>

      <section class="admin-grid">
        <article class="soft-card action-card" @click="$router.push('/kelola-produk')">
          <div class="action-icon">
            <i class="fas fa-box-open"></i>
          </div>
          <div>
            <h3>Kelola Produk</h3>
            <p>Tambah, edit, dan hapus katalog produk sesuai kebutuhan toko.</p>
          </div>
          <span class="action-link">Buka modul</span>
        </article>

        <article class="soft-card action-card" @click="$router.push('/kelola-pesanan')">
          <div class="action-icon">
            <i class="fas fa-receipt"></i>
          </div>
          <div>
            <h3>Kelola Pesanan</h3>
            <p>Pantau status pembayaran dan proses order pelanggan dari satu halaman.</p>
          </div>
          <span class="action-link">Buka modul</span>
        </article>

        <article class="soft-card action-card" @click="$router.push('/history-admin')">
          <div class="action-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div>
            <h3>History Penjualan</h3>
            <p>Lihat ringkasan penjualan per bulan dan tahun untuk memantau performa toko.</p>
          </div>
          <span class="action-link">Buka modul</span>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "DashboardAdmin",
  methods: {
    logout() {
      Swal.fire({
        title: "Logout dari admin?",
        text: "Kamu akan kembali ke halaman login.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, logout"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.post("/logout");
          } catch (error) {
            console.error("Gagal logout di server:", error);
          }

          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");

          Swal.fire({
            title: "Logout berhasil",
            text: "Sampai jumpa lagi, Admin.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });

          setTimeout(() => {
            this.$router.push("/");
            window.location.reload();
          }, 1500);
        }
      });
    }
  }
};
</script>

<style scoped>
.admin-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 26px;
}

.admin-hero {
  padding: 30px;
  display: grid;
  gap: 24px;
}

.hero-copy {
  display: grid;
  gap: 18px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 22px;
}

.action-card {
  padding: 24px;
  display: grid;
  gap: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(221, 95, 59, 0.28);
}

.action-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--brand-50), #fff);
  color: var(--brand-600);
  font-size: 1.35rem;
}

.action-card h3 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 1.2rem;
}

.action-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.action-link {
  color: var(--brand-700);
  font-weight: 700;
}

@media (max-width: 640px) {
  .admin-content {
    padding-bottom: 48px;
  }

  .admin-hero {
    padding: 22px;
  }
}
</style>
