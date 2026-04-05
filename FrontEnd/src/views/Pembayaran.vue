<template>
  <div class="payment-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>
      <div class="nav-links">
        <router-link class="nav-link" to="/dashboard-pembeli">Dashboard</router-link>
        <router-link class="nav-link" to="/history-pembeli">Riwayat</router-link>
      </div>
    </header>

    <main class="shell-content payment-content">
      <section class="payment-header">
        <span class="section-eyebrow">Pembayaran QRIS</span>
        <h1 class="section-title">Selesaikan pembayaran agar pesanan segera diproses.</h1>
        <p class="section-copy">Scan QRIS berikut untuk menyelesaikan pembayaran pesananmu.</p>
      </section>

      <section class="payment-grid">
        <article class="surface-card payment-summary">
          <h3>Total Pembayaran</h3>
          <p class="amount">Rp {{ totalPembayaran.toLocaleString('id-ID') }}</p>
          <span class="badge badge--warning">Menunggu konfirmasi sistem</span>
        </article>

        <article class="surface-card qris-card">
          <h3>Scan QRIS</h3>
          <p class="section-subtitle">Gunakan e-wallet atau mobile banking favoritmu.</p>

          <div class="qris-box">
            <img v-if="qrisUrl" :src="qrisUrl" alt="QRIS Code" class="qris-img" />
            <p v-else class="loading-text">Sedang membuat QRIS...</p>
          </div>

          <p class="info-text">(Pembayaran akan terkonfirmasi otomatis oleh sistem.)</p>
        </article>
      </section>

      <section class="surface-card confirmation-card">
        <div>
          <h3>Sudah selesai membayar?</h3>
          <p>Status akan berubah menjadi paid setelah verifikasi otomatis selesai.</p>
        </div>

        <button class="primary-btn" @click="goToHistory">Saya Sudah Membayar</button>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "PembayaranPage",
  data() {
    return {
      totalPembayaran: 0,
      qrisUrl: null
    };
  },
  mounted() {
    const total = localStorage.getItem("paymentTotal");
    const url = localStorage.getItem("paymentQrisUrl");

    if (total && url) {
      this.totalPembayaran = parseInt(total, 10);
      this.qrisUrl = url;

      localStorage.removeItem("paymentTotal");
      localStorage.removeItem("paymentQrisUrl");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data pembayaran. Silakan checkout ulang."
      });
      this.$router.push("/dashboard-pembeli");
    }
  },
  methods: {
    goToHistory() {
      Swal.fire({
        icon: "info",
        title: "Mengarahkan ke history",
        html: `
          <p>Status pesanan akan berubah menjadi <b>Paid</b> setelah pembayaranmu diverifikasi sistem.</p>
          <p style="margin-top:10px; font-size: 14px;">Biasanya 1-2 menit setelah bayar.</p>
        `
      }).then(() => {
        this.$router.push("/history-pembeli");
      });
    }
  }
};
</script>

<style scoped>
.payment-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 24px;
}

.payment-header {
  display: grid;
  gap: 16px;
  max-width: 780px;
}

.payment-grid {
  display: grid;
  grid-template-columns: minmax(260px, 320px) 1fr;
  gap: 24px;
  align-items: start;
}

.payment-summary,
.qris-card,
.confirmation-card {
  padding: 24px;
}

.payment-summary h3,
.qris-card h3,
.confirmation-card h3 {
  margin: 0 0 10px;
  font-family: var(--font-display);
}

.amount {
  margin: 0 0 18px;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--brand-700);
}

.qris-card {
  display: grid;
  gap: 14px;
}

.qris-box {
  min-height: 320px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 243, 237, 0.75), rgba(255, 255, 255, 0.96));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
}

.qris-img {
  max-width: min(100%, 300px);
  border-radius: 18px;
}

.loading-text,
.info-text,
.confirmation-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.confirmation-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .payment-content {
    padding-bottom: 48px;
  }

  .payment-summary,
  .qris-card,
  .confirmation-card {
    padding: 20px;
  }

  .qris-box {
    min-height: 260px;
  }
}
</style>
