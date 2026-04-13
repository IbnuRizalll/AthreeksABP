<template>
  <div class="landing-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>

      <div class="nav-links">
        <a href="#" class="nav-link" @click.prevent="goDashboardGuest">Etalase</a>
        <button class="ghost-btn nav-action" @click="masuk('login')">Masuk</button>
      </div>
    </header>

    <main class="shell-content landing-main">
      <section class="landing-copy">
        <span class="section-eyebrow">Selamat Datang</span>
        <h1 class="page-title">Makanan dan aksesoris pilihan dalam satu tempat.</h1>
        <p class="section-copy">
          Athreeks menghadirkan Makanan dan aksesoris pilihan untuk hadiah, camilan, dan kebutuhan harian
          dengan pengalaman belanja yang praktis.
        </p>

        <div class="cta-row">
          <button class="primary-btn" @click="masuk('login')">Masuk ke Akun</button>
          <button class="secondary-btn" @click="masuk('registrasi')">Buat Akun Baru</button>
          <a href="#" class="catalog-link" @click.prevent="goDashboardGuest">Lihat Etalase</a>
        </div>

        <div class="stat-grid">
          <article class="surface-card stat-card">
            <p class="stat-label">Belanja Mudah</p>
            <p class="stat-value">Pesan Dalam Menit</p>
          </article>
          <article class="surface-card stat-card">
            <p class="stat-label">Kategori Utama</p>
            <p class="stat-value">Salad & Aksesoris</p>
          </article>
          <article class="surface-card stat-card">
            <p class="stat-label">Akses Cepat</p>
            <p class="stat-value">Lihat Etalase</p>
          </article>
        </div>
      </section>

      <section class="landing-visual">
        <div class="surface-card visual-panel">
          <div class="visual-badge">
            <span>Produk pilihan</span>
            <strong>Siap dipesan</strong>
          </div>

          <div class="visual-showcase">
            <img
              src="@/assets/Screenshot_2025-09-27_062833-removebg-preview.png"
              alt="Athreeks hero product"
              class="hero-image"
            />

            <div class="floating-note floating-note--bottom">
              <span>Belanja praktis</span>
              <strong>Login dan pesan kapan saja</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "DashboardAwal",
  methods: {
    masuk(role) {
      if (role === "login") {
        this.$router.push("/login");
      } else if (role === "registrasi") {
        this.$router.push("/registrasi");
      }
    },
    goDashboardGuest() {
      this.$router.push("/dashboard-guest");
    }
  }
};
</script>

<style scoped>

.hero-section {
  position: relative;
  background: linear-gradient(135deg, rgba(255,180,150,0.1) 0%, rgba(255,220,180,0.1) 100%);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.landing-main {
  padding: 36px 0 72px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 32px;
  align-items: center;
}

.landing-copy {
  display: grid;
  gap: 24px;
}

.catalog-link {
  color: var(--brand-700);
  font-weight: 700;
}

.catalog-link:hover {
  color: var(--brand-500);
}

.nav-action {
  padding-inline: 18px;
}

.landing-visual {
  display: flex;
  justify-content: flex-end;
}

.visual-panel {
  width: min(100%, 520px);
  padding: 28px;
  display: grid;
  gap: 22px;
}

.visual-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 243, 237, 0.95), rgba(255, 255, 255, 0.9));
  border: 1px solid rgba(221, 95, 59, 0.15);
}

.visual-badge span {
  color: var(--muted);
  font-size: 0.92rem;
}

.visual-badge strong {
  font-family: var(--font-display);
  color: var(--brand-700);
}

.visual-showcase {
  position: relative;
  padding: 48px 22px 38px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(221, 95, 59, 0.16), transparent 15rem),
    linear-gradient(180deg, #fff9f6 0%, #ffffff 100%);
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: min(100%, 420px);
  object-fit: contain;
  filter: drop-shadow(0 30px 50px rgba(16, 24, 40, 0.14));
}

.floating-note {
  position: absolute;
  max-width: 210px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(208, 213, 221, 0.7);
  box-shadow: var(--shadow-sm);
}

.floating-note span {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
  margin-bottom: 6px;
}

.floating-note strong {
  display: block;
  color: var(--text);
  font-size: 0.98rem;
  line-height: 1.5;
}

.floating-note--top {
  top: 18px;
  right: 18px;
}

.floating-note--bottom {
  bottom: 18px;
  left: 18px;
}

@media (max-width: 960px) {
  .landing-main {
    grid-template-columns: 1fr;
    padding-top: 24px;
  }

  .landing-visual {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .landing-main {
    gap: 24px;
    padding-bottom: 48px;
  }

  .visual-panel {
    padding: 18px;
  }

  .visual-showcase {
    min-height: 420px;
    padding: 64px 14px 72px;
  }

  .floating-note {
    max-width: 160px;
    padding: 12px 14px;
  }
}
</style>



