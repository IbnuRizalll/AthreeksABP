<template>
  <div class="customer-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>

      <div class="nav-links">
        <router-link class="nav-link" to="/history-pembeli">Riwayat</router-link>

        <button class="ghost-btn icon-button" @click="toggleCart">
          <i class="fas fa-shopping-bag"></i>
          <span>Keranjang</span>
          <strong v-if="cartItems.length > 0" class="count-badge">{{ cartItems.length }}</strong>
        </button>

        <div class="profile-menu">
          <button class="secondary-btn profile-trigger" @click="toggleDropdown">
            <i class="fas fa-user-circle"></i>
            <span>Akun</span>
          </button>

          <div v-if="dropdownOpen" class="surface-card profile-dropdown">
            <router-link to="/profile" class="dropdown-link">
              <i class="fas fa-id-badge"></i>
              <span>Profil</span>
            </router-link>
            <button class="dropdown-link" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div v-if="cartOpen" class="drawer-backdrop" @click="cartOpen = false"></div>

    <aside v-if="cartOpen" class="surface-card cart-drawer" @click.stop>
      <div class="drawer-head">
        <div>
          <h3>Keranjang Belanja</h3>
          <p>Pilih item yang ingin kamu proses lebih dulu.</p>
        </div>
        <button class="ghost-btn close-btn" @click="cartOpen = false">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div v-if="isLoadingCart" class="loading-state">Memuat keranjang...</div>
      <div v-else-if="cartItems.length === 0" class="empty-state">Keranjang masih kosong.</div>

      <div v-else class="cart-content">
        <div v-for="(item, index) in cartItems" :key="item.cart_id" class="soft-card cart-item">
          <label class="cart-select">
            <input v-model="item.selected" type="checkbox" class="cart-checkbox" />
            <span>Pilih</span>
          </label>

          <img :src="item.image" :alt="item.name" class="cart-image" />

          <div class="cart-info">
            <div class="cart-line">
              <p class="cart-name">{{ item.name }}</p>
              <button class="ghost-btn delete-btn" @click="hapusProduk(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <p class="cart-price">Rp {{ formatHarga(item.price) }} / pcs</p>

            <div class="cart-line">
              <div class="qty-control">
                <button class="qty-btn" @click="updateJumlah(index, -1)" :disabled="item.quantity <= 1 || item.isUpdating">
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button class="qty-btn" @click="updateJumlah(index, 1)" :disabled="item.isUpdating">+</button>
              </div>

              <strong>Rp {{ formatHarga(item.price * item.quantity) }}</strong>
            </div>
          </div>
        </div>

        <div class="surface-card cart-summary">
          <div>
            <span class="summary-label">Item dipilih</span>
            <strong>{{ itemDipilihCount }} produk</strong>
          </div>
          <div>
            <span class="summary-label">Total pembayaran</span>
            <strong>Rp {{ formatHarga(totalDipilih) }}</strong>
          </div>
        </div>

        <button class="primary-btn process-btn" :disabled="totalDipilih === 0" @click="prosesPesanan">
          Proses Pesanan
        </button>
      </div>
    </aside>

    <main class="shell-content customer-content">
      <section class="surface-card customer-hero">
        <div class="hero-copy">
          <span class="section-eyebrow">Dashboard Pembeli</span>
          <h1 class="section-title">Temukan produk favoritmu dan lanjutkan pesanan dengan lebih mudah.</h1>
          <p class="section-copy">
            Jelajahi produk, tambahkan ke keranjang, lalu lanjut ke pembayaran dari satu tempat.
          </p>

          <div class="cta-row">
            <button class="primary-btn" @click="toggleCart">Buka Keranjang</button>
            <router-link class="secondary-btn quick-link" to="/history-pembeli">Lihat Riwayat</router-link>
          </div>
        </div>

        <div class="stat-grid">
          <article class="soft-card stat-card">
            <p class="stat-label">Katalog aktif</p>
            <p class="stat-value">{{ produkList.length }}</p>
          </article>
          <article class="soft-card stat-card">
            <p class="stat-label">Item di keranjang</p>
            <p class="stat-value">{{ cartItems.length }}</p>
          </article>
          <article class="soft-card stat-card">
            <p class="stat-label">Siap checkout</p>
            <p class="stat-value">{{ itemDipilihCount }}</p>
          </article>
        </div>
      </section>

      <section class="catalog-controls">
        <div>
          <span class="section-eyebrow">Katalog Produk</span>
          <h2 class="section-title">Etalase Produk</h2>
        </div>

        <div class="filter-row">
          <button
            class="filter-chip"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            Semua
          </button>
          <button
            v-for="kategori in kategoriProduk"
            :key="kategori"
            class="filter-chip"
            :class="{ active: selectedCategory === kategori }"
            @click="selectedCategory = kategori"
          >
            {{ kategori }}
          </button>
        </div>
      </section>

      <div v-if="isLoadingProduk" class="surface-card loading-state">Memuat produk...</div>

      <section v-else class="product-grid">
        <article v-for="produk in filteredProdukList" :key="produk.id" class="soft-card product-card">
          <div class="product-image" @click="lihatDetail(produk.id)">
            <img :src="produk.image" :alt="produk.name" class="img-clickable" />
          </div>

          <div class="product-body">
            <div class="product-meta">
              <span class="product-tag">{{ produk.category }}</span>
              <strong>Rp {{ formatHarga(produk.price) }}</strong>
            </div>

            <h3>{{ produk.name }}</h3>
            <p>{{ produk.description }}</p>
          </div>

          <div class="product-actions">
            <button class="secondary-btn" @click="lihatDetail(produk.id)">
              <i class="fas fa-eye"></i>
              <span>Detail</span>
            </button>
            <button class="primary-btn add-btn" @click="tambahKeKeranjang(produk)">
              <i class="fas fa-cart-plus"></i>
              <span>Tambah</span>
            </button>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "DashboardPembeli",
  data() {
    return {
      dropdownOpen: false,
      cartOpen: false,
      produkList: [],
      cartItems: [],
      isLoadingProduk: false,
      isLoadingCart: false,
      selectedCategory: "all"
    };
  },
  computed: {
    totalDipilih() {
      return this.cartItems
        .filter((item) => item.selected)
        .reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    itemDipilihCount() {
      return this.cartItems.filter((item) => item.selected).length;
    },
    kategoriProduk() {
      return [...new Set(this.produkList.map((item) => item.category))];
    },
    filteredProdukList() {
      if (this.selectedCategory === "all") {
        return this.produkList;
      }

      return this.produkList.filter((item) => item.category === this.selectedCategory);
    }
  },
  mounted() {
    this.getProduk();
    this.getKeranjang();
  },
  methods: {
    async getProduk() {
      this.isLoadingProduk = true;
      try {
        const res = await api.get("/products");

        this.produkList = res.data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image_url,
          category: p.category
        }));
      } catch (err) {
        console.error("Gagal memuat produk:", err);
        Swal.fire("Gagal", "Tidak bisa mengambil data produk.", "error");
      } finally {
        this.isLoadingProduk = false;
      }
    },
    async getKeranjang() {
      this.isLoadingCart = true;
      try {
        const res = await api.get("/cart");

        this.cartItems = res.data.map((item) => ({
          cart_id: item.id,
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image_url,
          quantity: item.quantity,
          selected: false,
          isUpdating: false
        }));
      } catch (err) {
        console.error("Gagal memuat keranjang:", err);
      } finally {
        this.isLoadingCart = false;
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
      this.cartOpen = false;
    },
    toggleCart() {
      this.cartOpen = !this.cartOpen;
      this.dropdownOpen = false;
    },
    formatHarga(angka) {
      if (!angka) return "0";
      return angka.toLocaleString("id-ID");
    },
    lihatDetail(id) {
      this.$router.push(`/produk/${id}`);
    },
    async tambahKeKeranjang(produk) {
      try {
        await api.post("/cart", {
          product_id: produk.id,
          quantity: 1
        });

        await this.getKeranjang();
        this.cartOpen = true;

        Swal.fire({
          icon: "success",
          title: "Produk ditambahkan",
          text: `${produk.name} masuk ke keranjang.`,
          timer: 1200,
          showConfirmButton: false
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Gagal menambah ke keranjang.", "error");
      }
    },
    async updateJumlah(index, amount) {
      const item = this.cartItems[index];
      const newQty = parseInt(item.quantity, 10) + amount;

      if (newQty < 1) return;

      item.isUpdating = true;

      try {
        await api.put(`/cart/${item.cart_id}`, {
          quantity: newQty
        });

        item.quantity = newQty;
      } catch (error) {
        console.error("Gagal update qty:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengubah jumlah barang."
        });
      } finally {
        item.isUpdating = false;
      }
    },
    hapusProduk(index) {
      const item = this.cartItems[index];

      Swal.fire({
        title: "Hapus produk?",
        text: `Yakin ingin menghapus ${item.name} dari keranjang?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.delete(`/cart/${item.cart_id}`);
            this.cartItems.splice(index, 1);

            Swal.fire({
              title: "Terhapus",
              text: "Produk dihapus dari keranjang.",
              icon: "success",
              timer: 1200,
              showConfirmButton: false
            });
          } catch (err) {
            Swal.fire("Gagal", "Gagal menghapus item.", "error");
          }
        }
      });
    },
    prosesPesanan() {
      const dipilih = this.cartItems.filter((item) => item.selected);

      if (dipilih.length === 0) {
        Swal.fire({
          title: "Belum ada yang dipilih",
          text: "Silakan centang produk yang ingin kamu proses.",
          icon: "warning"
        });
        return;
      }

      localStorage.setItem("checkoutItems", JSON.stringify(dipilih));
      localStorage.setItem("checkoutTotal", this.totalDipilih);

      Swal.fire({
        title: "Lanjut ke pengiriman?",
        text: `Kamu akan memproses ${dipilih.length} item.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjut"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/proses-pesanan");
        }
      });
    },
    logout() {
      Swal.fire({
        title: "Logout sekarang?",
        text: "Kamu akan kembali ke halaman awal.",
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
            title: "Berhasil logout",
            text: "Sampai jumpa lagi.",
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
.customer-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 26px;
}

.customer-hero {
  padding: 28px;
  display: grid;
  gap: 24px;
}

.hero-copy {
  display: grid;
  gap: 18px;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.catalog-controls {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  border: 1px solid rgba(208, 213, 221, 0.8);
  background: rgba(255, 255, 255, 0.85);
  color: var(--muted-strong);
  border-radius: var(--radius-pill);
  padding: 10px 14px;
  font-weight: 700;
  text-transform: capitalize;
}

.filter-chip.active {
  background: var(--brand-500);
  border-color: var(--brand-500);
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.product-card {
  padding: 18px;
  display: grid;
  gap: 16px;
}

.product-image {
  min-height: 230px;
  padding: 18px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 243, 237, 0.8), rgba(255, 255, 255, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-height: 210px;
  object-fit: contain;
}

.img-clickable {
  cursor: pointer;
}

.product-body {
  display: grid;
  gap: 12px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.product-tag {
  display: inline-flex;
  align-items: center;
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
  font-size: 1.15rem;
}

.product-body p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.product-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.product-actions button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.count-badge {
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--brand-500);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
}

.profile-menu {
  position: relative;
}

.profile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 190px;
  padding: 8px;
  border-radius: 20px;
  display: grid;
  gap: 4px;
  z-index: 20;
}

.dropdown-link {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--muted-strong);
  padding: 12px 14px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.dropdown-link:hover {
  background: rgba(255, 243, 237, 0.8);
  color: var(--text);
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  z-index: 20;
}

.cart-drawer {
  position: fixed;
  top: 20px;
  right: 20px;
  bottom: 20px;
  width: min(420px, calc(100% - 24px));
  padding: 20px;
  z-index: 30;
  overflow-y: auto;
  display: grid;
  gap: 18px;
}

.drawer-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.drawer-head h3 {
  margin: 0 0 6px;
  font-family: var(--font-display);
}

.drawer-head p {
  margin: 0;
  color: var(--muted);
}

.close-btn {
  padding: 0;
}

.cart-content {
  display: grid;
  gap: 16px;
}

.cart-item {
  padding: 16px;
  display: grid;
  grid-template-columns: auto 84px 1fr;
  gap: 14px;
  align-items: center;
}

.cart-select {
  display: grid;
  justify-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.82rem;
}

.cart-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--brand-500);
}

.cart-image {
  width: 84px;
  height: 84px;
  object-fit: cover;
  border-radius: 22px;
  background: var(--surface-muted);
}

.cart-info {
  display: grid;
  gap: 10px;
}

.cart-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.cart-name,
.cart-price {
  margin: 0;
}

.cart-name {
  font-weight: 800;
}

.cart-price {
  color: var(--muted);
}

.delete-btn {
  padding: 0;
  color: #dc2626;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  background: var(--surface-strong);
  color: var(--text);
  font-weight: 800;
}

.qty-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.cart-summary {
  padding: 18px;
  display: grid;
  gap: 14px;
}

.summary-label {
  display: block;
  font-size: 0.82rem;
  color: var(--muted);
  margin-bottom: 6px;
}

.process-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .customer-content {
    padding-bottom: 48px;
  }

  .customer-hero {
    padding: 22px;
  }

  .catalog-controls {
    align-items: start;
  }

  .product-actions {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .cart-select {
    justify-items: start;
    grid-auto-flow: column;
    justify-content: start;
  }

  .cart-image {
    width: 100%;
    height: 180px;
  }
}
</style>
