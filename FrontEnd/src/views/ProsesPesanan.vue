<template>
  <div class="checkout-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>
      <div class="nav-links">
        <router-link class="nav-link" to="/dashboard-pembeli">Kembali ke dashboard</router-link>
      </div>
    </header>

    <main class="shell-content checkout-content">
      <section class="checkout-header">
        <span class="section-eyebrow">Proses Pesanan</span>
        <h1 class="section-title">Lengkapi detail pengiriman sebelum lanjut ke pembayaran.</h1>
        <p class="section-copy">Pilih metode pengiriman dan pastikan detail pesananmu sudah sesuai.</p>
      </section>

      <div class="checkout-grid">
        <section class="surface-card checkout-card">
          <div class="card-head">
            <h3>Rincian Pesanan</h3>
            <p>Pastikan item yang kamu pilih sudah sesuai.</p>
          </div>

          <div v-if="pesanan.length === 0" class="loading-state">Memuat rincian...</div>

          <div v-else class="order-list">
            <article v-for="(produk, index) in pesanan" :key="index" class="soft-card order-item">
              <img :src="produk.image" :alt="produk.name" />

              <div class="order-copy">
                <strong>{{ produk.name }}</strong>
                <p>{{ produk.quantity }} pcs</p>
                <span>Rp {{ formatHarga(produk.price * produk.quantity) }}</span>
              </div>
            </article>

            <div class="surface-card total-card">
              <span class="summary-label">Total pembayaran</span>
              <strong>Rp {{ formatHarga(totalHarga) }}</strong>
            </div>
          </div>
        </section>

        <section class="surface-card checkout-card">
          <div class="card-head">
            <h3>Detail Pengiriman</h3>
            <p>Pilih metode pengantaran yang paling sesuai.</p>
          </div>

          <div class="field">
            <label for="pengantaran">Jenis Pengantaran</label>
            <select id="pengantaran" v-model="jenisPengantaran">
              <option disabled value="">-- Pilih Pengantaran --</option>
              <option>Diantar ke Rumah</option>
              <option>COD (Ambil di Telkom University Purwokerto)</option>
            </select>
          </div>

          <div v-if="jenisPengantaran === 'Diantar ke Rumah'" class="field">
            <label for="alamat">Alamat Lengkap</label>
            <textarea
              id="alamat"
              v-model="alamat"
              rows="4"
              placeholder="Masukkan alamat lengkap kamu"
            ></textarea>
          </div>

          <div
            v-if="jenisPengantaran === 'COD (Ambil di Telkom University Purwokerto)'"
            class="soft-card pickup-info"
          >
            <h4>Titik Ambil</h4>
            <p>
              Telkom University Purwokerto, Jl. DI Panjaitan No.128, Karangreja, Purwokerto Kidul, Banyumas.
            </p>
            <p>
              Hubungi admin via WhatsApp:
              <a href="https://wa.me/6289638991030" target="_blank" rel="noreferrer">0896-3899-1030</a>
            </p>
          </div>

          <button class="primary-btn payment-btn" @click="lanjutPembayaran" :disabled="isLoading">
            {{ isLoading ? 'Memproses...' : 'Lanjut ke Pembayaran' }}
          </button>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "ProsesPesanan",
  data() {
    return {
      jenisPengantaran: "",
      alamat: "",
      pesanan: [],
      totalHarga: 0,
      isLoading: false
    };
  },
  mounted() {
    const items = localStorage.getItem("checkoutItems");
    const total = localStorage.getItem("checkoutTotal");

    if (items && total) {
      this.pesanan = JSON.parse(items);
      this.totalHarga = parseInt(total, 10);

      if (this.pesanan.length === 0 || !this.pesanan[0].cart_id) {
        Swal.fire("Error", "Data keranjang tidak valid. Silakan ulangi.", "error");
        this.$router.push("/dashboard-pembeli");
      }
    } else {
      Swal.fire("Keranjang kosong", "Silakan pilih produk dulu.", "warning");
      this.$router.push("/dashboard-pembeli");
    }
  },
  methods: {
    formatHarga(angka) {
      if (!angka) return "0";
      return angka.toLocaleString("id-ID");
    },
    async lanjutPembayaran() {
      if (!this.jenisPengantaran) {
        Swal.fire({
          icon: "warning",
          title: "Pilih pengantaran",
          text: "Silakan pilih jenis pengantaran terlebih dahulu."
        });
        return;
      }

      if (this.jenisPengantaran === "Diantar ke Rumah" && !this.alamat) {
        Swal.fire({
          icon: "warning",
          title: "Alamat kosong",
          text: "Kamu perlu mengisi alamat lengkap dulu."
        });
        return;
      }

      this.isLoading = true;

      const cartIds = this.pesanan.map((item) => item.cart_id);
      let alamatKirim = null;

      if (this.jenisPengantaran === "Diantar ke Rumah") {
        alamatKirim = this.alamat;
      } else {
        alamatKirim = "COD (Ambil di Telkom University Purwokerto)";
      }

      try {
        const response = await api.post("/checkout", {
          cart_ids: cartIds,
          alamat_pengiriman: alamatKirim
        });

        const qrisUrl = response.data.qris_url;
        const total = response.data.total;

        localStorage.setItem("paymentQrisUrl", qrisUrl);
        localStorage.setItem("paymentTotal", total);
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("checkoutTotal");

        Swal.fire({
          title: "Pesanan dibuat",
          text: "Mengarahkan ke halaman pembayaran QRIS...",
          icon: "success",
          timer: 1600,
          showConfirmButton: false
        }).then(() => {
          this.$router.push("/pembayaran");
        });
      } catch (error) {
        console.error("Checkout Gagal:", error);
        Swal.fire("Checkout gagal", "Terjadi kesalahan saat membuat pesanan.", "error");
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.checkout-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 24px;
}

.checkout-header {
  display: grid;
  gap: 16px;
  max-width: 760px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.checkout-card {
  padding: 24px;
  display: grid;
  gap: 18px;
}

.card-head h3 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.card-head p {
  margin: 0;
  color: var(--muted);
}

.order-list {
  display: grid;
  gap: 16px;
}

.order-item {
  padding: 14px;
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 14px;
  align-items: center;
}

.order-item img {
  width: 92px;
  height: 92px;
  border-radius: 22px;
  object-fit: cover;
  background: var(--surface-muted);
}

.order-copy {
  display: grid;
  gap: 6px;
}

.order-copy p,
.order-copy span {
  margin: 0;
  color: var(--muted);
}

.order-copy strong {
  font-size: 1rem;
}

.total-card {
  padding: 18px;
}

.pickup-info {
  padding: 18px;
  display: grid;
  gap: 8px;
}

.pickup-info h4,
.pickup-info p {
  margin: 0;
}

.pickup-info p {
  color: var(--muted);
  line-height: 1.7;
}

.pickup-info a {
  color: var(--brand-700);
  font-weight: 700;
}

.payment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .checkout-content {
    padding-bottom: 48px;
  }

  .checkout-card {
    padding: 20px;
  }

  .order-item {
    grid-template-columns: 1fr;
  }

  .order-item img {
    width: 100%;
    height: 180px;
  }
}
</style>
