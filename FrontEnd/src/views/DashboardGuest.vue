<template>
  <div class="guest-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>

      <div class="nav-links">
        <button class="ghost-btn nav-link" @click="$router.push('/')">Beranda</button>
        <button class="secondary-btn" @click="backToLogin">Masuk untuk belanja</button>
      </div>
    </header>

    <main class="shell-content guest-content">
      <section class="guest-hero surface-card">
        <div class="hero-copy">
          <span class="section-eyebrow">Etalase Publik</span>
          <h1 class="section-title">Lihat koleksi Athreeks sebelum masuk ke akunmu.</h1>
          <p class="section-copy">
            Jelajahi koleksi Athreeks lebih dulu. Saat siap membeli, kamu bisa masuk untuk melanjutkan pesanan.
          </p>

          <div class="cta-row">
            <button class="primary-btn" @click="backToLogin">Login untuk checkout</button>
            <button class="secondary-btn" @click="$router.push('/')">Kembali ke landing</button>
          </div>
        </div>

          <div class="hero-side">
            <div class="soft-card side-card">
            <strong>Produk pilihan</strong>
            <span>Lihat salad buah dan aksesoris yang tersedia sebelum masuk.</span>
            </div>
            <div class="soft-card side-card">
            <strong>Siap dipesan</strong>
            <span>Pembelian tetap dilanjutkan setelah login ke akunmu.</span>
            </div>
          </div>
      </section>

      <section class="catalog-section">
        <div class="catalog-head">
          <div>
            <span class="section-eyebrow">Produk</span>
            <h2 class="section-title">Etalase Athreeks</h2>
          </div>
          <p class="section-subtitle">Preview produk terbaru untuk salad dan aksesoris pilihan.</p>
        </div>

        <div v-if="isLoading" class="surface-card loading-state">
          <p>Memuat produk...</p>
        </div>

        <div v-else class="product-grid">
          <article v-for="produk in produkList" :key="produk.id" class="soft-card product-card">
            <div class="product-image-wrap">
              <img :src="produk.image_url" :alt="produk.name" />
            </div>

            <div class="product-body">
              <div class="product-meta">
                <span class="product-tag">{{ produk.category || 'Produk' }}</span>
                <strong>Rp {{ formatHarga(produk.price) }}</strong>
              </div>

              <h3>{{ produk.name }}</h3>
              <p>{{ produk.description }}</p>
            </div>

            <button class="secondary-btn product-cta" @click="backToLogin">Login untuk beli</button>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "DashboardGuest",
  data() {
    return {
      produkList: [],
      isLoading: false
    };
  },
  mounted() {
    this.fetchProduk();
  },
  methods: {
    async fetchProduk() {
      this.isLoading = true;

      try {
        const response = await api.get("/products");
        this.produkList = response.data;
      } catch (error) {
        console.error("Gagal memuat produk:", error);
      } finally {
        this.isLoading = false;
      }
    },
    formatHarga(angka) {
      if (!angka) return "0";
      return Number(angka).toLocaleString("id-ID");
    },
    backToLogin() {
      Swal.fire({
        title: "Lanjut ke login?",
        text: "Kamu akan diarahkan ke halaman login untuk melanjutkan pembelian.",
        icon: "question",
        confirmButtonText: "Ya, lanjutkan"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/login");
        }
      });
    }
  }
};
</script>

<style scoped>
.guest-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 28px;
}

.guest-hero {
  padding: 28px;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 24px;
}

.hero-copy,
.hero-side {
  display: grid;
  gap: 18px;
}

.side-card {
  padding: 20px;
  display: grid;
  gap: 8px;
}

.side-card strong {
  font-family: var(--font-display);
}

.side-card span {
  color: var(--muted);
  line-height: 1.7;
}

.catalog-section {
  display: grid;
  gap: 20px;
}

.catalog-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.catalog-head p {
  max-width: 420px;
  margin: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 22px;
}

.product-card {
  padding: 18px;
  display: grid;
  gap: 16px;
}

.product-image-wrap {
  background: linear-gradient(180deg, rgba(255, 243, 237, 0.75), rgba(255, 255, 255, 0.8));
  border-radius: 24px;
  padding: 18px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image-wrap img {
  max-height: 200px;
  object-fit: contain;
}

.product-body {
  display: grid;
  gap: 12px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  color: var(--muted-strong);
}

.product-tag {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  background: var(--brand-50);
  color: var(--brand-700);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
}

.product-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.1rem;
}

.product-body p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.product-cta {
  width: 100%;
}

@media (max-width: 900px) {
  .guest-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .guest-content {
    padding-bottom: 48px;
  }

  .guest-hero {
    padding: 20px;
  }
}
</style>
