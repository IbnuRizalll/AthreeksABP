<template>
  <div class="detail-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>
      <div class="nav-links">
        <button class="secondary-btn" @click="$router.push('/dashboard-pembeli')">Kembali ke katalog</button>
      </div>
    </header>

    <main class="shell-content detail-content">
      <div v-if="isLoading" class="surface-card loading-state">Memuat detail produk...</div>

      <transition name="fade-scale" appear>
        <section v-if="produk && !isLoading" class="surface-card detail-card">
          <div class="detail-image">
            <img :src="produk.image_url" :alt="produk.name" />
          </div>

          <div class="detail-copy">
            <span class="section-eyebrow">Detail Produk</span>
            <h1 class="section-title">{{ produk.name }}</h1>
            <p class="section-copy">{{ produk.description }}</p>

            <div class="detail-meta">
              <span class="product-tag">{{ produk.category }}</span>
              <strong>Rp {{ formatHarga(produk.price) }}</strong>
            </div>

            <div class="field qty-field">
              <label for="jumlah">Jumlah</label>
              <input id="jumlah" v-model.number="count" type="number" min="1" />
            </div>

            <button class="primary-btn add-btn" @click="addToCart" :disabled="isAdding">
              <i class="fas fa-cart-plus"></i>
              <span>{{ isAdding ? 'Menambahkan...' : 'Masukkan ke keranjang' }}</span>
            </button>
          </div>
        </section>
      </transition>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "RincianProduk",
  data() {
    return {
      count: 1,
      produk: null,
      isLoading: true,
      isAdding: false
    };
  },
  mounted() {
    this.fetchProduk();
  },
  methods: {
    async fetchProduk() {
      this.isLoading = true;
      const produkId = this.$route.params.id;

      try {
        const response = await api.get(`/products/${produkId}`);
        this.produk = response.data;
      } catch (error) {
        console.error("Gagal memuat produk:", error);
        Swal.fire({
          title: "Error",
          text: "Gagal memuat detail produk.",
          icon: "error"
        }).then(() => {
          this.$router.push("/dashboard-pembeli");
        });
      } finally {
        this.isLoading = false;
      }
    },
    formatHarga(angka) {
      if (!angka) return "0";
      return angka.toLocaleString("id-ID");
    },
    async addToCart() {
      this.isAdding = true;
      try {
        await api.post("/cart", {
          product_id: this.produk.id,
          quantity: this.count
        });

        Swal.fire({
          title: "Berhasil ditambahkan",
          text: `${this.count} x ${this.produk.name} masuk ke keranjang.`,
          icon: "success",
          timer: 1300,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Gagal menambah ke keranjang:", error);
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan saat menambah ke keranjang.",
          icon: "error"
        });
      } finally {
        this.isAdding = false;
      }
    }
  }
};
</script>

<style scoped>
.detail-content {
  padding: 28px 0 72px;
}

.detail-card {
  padding: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: center;
}

.detail-image {
  min-height: 420px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 243, 237, 0.75), rgba(255, 255, 255, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.detail-image img {
  max-height: 360px;
  object-fit: contain;
}

.detail-copy {
  display: grid;
  gap: 18px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.product-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  background: var(--brand-50);
  color: var(--brand-700);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: capitalize;
}

.qty-field {
  max-width: 180px;
  margin-bottom: 0;
}

.add-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.fade-scale-enter-active,
.fade-scale-appear-active {
  transition: all 0.35s ease;
}

.fade-scale-enter,
.fade-scale-appear {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

@media (max-width: 900px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .detail-content {
    padding-bottom: 48px;
  }

  .detail-card {
    padding: 20px;
  }

  .detail-image {
    min-height: 300px;
  }
}
</style>
