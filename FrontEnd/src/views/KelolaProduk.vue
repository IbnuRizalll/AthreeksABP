<template>
  <div class="admin-products page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks Admin</div>

      <div class="nav-links">
        <button class="secondary-btn" @click="$router.push('/dashboard-admin')">Dashboard admin</button>
      </div>
    </header>

    <main class="shell-content products-content">
      <section class="products-header">
        <div>
          <span class="section-eyebrow">Katalog Produk</span>
          <h1 class="section-title">Kelola katalog produk Athreeks dari satu halaman.</h1>
        </div>

        <button class="primary-btn" @click="tambahProduk">Tambah Produk</button>
      </section>

      <div v-if="isLoading" class="surface-card loading-state">Sedang memuat data produk...</div>

      <section v-else class="product-grid">
        <article v-for="produk in produkList" :key="produk.id" class="surface-card admin-product-card">
          <img :src="produk.image_url" :alt="produk.name" class="product-image" />

          <div class="product-copy">
            <div class="meta-line">
              <span class="product-tag">{{ produk.category }}</span>
              <strong>Rp{{ produk.price.toLocaleString() }}</strong>
            </div>

            <h2>{{ produk.name }}</h2>
            <p>{{ produk.description }}</p>
          </div>

          <div class="cta-row card-actions">
            <button class="secondary-btn action-btn" @click="editProduk(produk)">Edit</button>
            <button class="ghost-btn delete-btn" @click="hapusProduk(produk)">Hapus</button>
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
  name: "KelolaProduk",
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
        console.error("Gagal mengambil produk:", error);
        Swal.fire("Error", "Gagal memuat data produk.", "error");
      } finally {
        this.isLoading = false;
      }
    },
    async tambahProduk() {
      const { value: formValues } = await Swal.fire({
        title: "<h2 style='font-weight:bold'>Tambah Produk Baru</h2>",
        html: `
          <div class="my-swal-form">
            <div class="my-form-group">
              <label>Nama</label>
              <input id="nama" class="swal2-input" placeholder="Nama Produk">
            </div>
            <div class="my-form-group">
              <label>Deskripsi</label>
              <textarea id="deskripsi" class="swal2-textarea" placeholder="Deskripsi Produk"></textarea>
            </div>
            <div class="my-form-group">
              <label>Harga</label>
              <input id="harga" type="number" class="swal2-input" placeholder="Harga (Rp)">
            </div>
            <div class="my-form-group">
              <label>Kategori</label>
              <select id="category" class="swal2-input">
                <option value="salad">Salad</option>
                <option value="aksesoris">Aksesoris</option>
              </select>
            </div>
            <div class="my-form-group">
              <label>Gambar</label>
              <input id="gambar" type="file" accept="image/*" class="swal2-file">
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Tambah",
        cancelButtonText: "Batal",
        customClass: {
          popup: "my-custom-popup"
        },
        preConfirm: () => {
          const nama = document.getElementById("nama").value.trim();
          const harga = Number(document.getElementById("harga").value);
          const deskripsi = document.getElementById("deskripsi").value.trim();
          const category = document.getElementById("category").value;
          const file = document.getElementById("gambar").files[0];

          if (!nama || !harga || !deskripsi || !file || !category) {
            Swal.showValidationMessage("Semua kolom wajib diisi.");
            return false;
          }

          return { nama, harga, deskripsi, category, gambar: file };
        }
      });

      if (formValues) {
        this.processSubmit(formValues, "POST", "/products");
      }
    },
    async editProduk(produk) {
      const { value: formValues } = await Swal.fire({
        title: "<h2 style='font-weight:bold'>Edit Produk</h2>",
        html: `
          <div class="my-swal-form">
            <div class="my-form-group">
              <label>Nama</label>
              <input id="nama" class="swal2-input" value="${produk.name}">
            </div>
            <div class="my-form-group">
              <label>Deskripsi</label>
              <textarea id="deskripsi" class="swal2-textarea">${produk.description}</textarea>
            </div>
            <div class="my-form-group">
              <label>Harga</label>
              <input id="harga" type="number" class="swal2-input" value="${produk.price}">
            </div>
            <div class="my-form-group">
              <label>Kategori</label>
              <select id="category" class="swal2-input">
                <option value="salad" ${produk.category === "salad" ? "selected" : ""}>Salad</option>
                <option value="aksesoris" ${produk.category === "aksesoris" ? "selected" : ""}>Aksesoris</option>
              </select>
            </div>
            <div class="my-form-group">
              <label>Gambar (Opsional)</label>
              <input id="gambar" type="file" accept="image/*" class="swal2-file">
            </div>
            <small style="text-align:center; color: #667085; display:block; margin-top:5px;">Kosongkan gambar jika tidak ingin mengubahnya.</small>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        customClass: {
          popup: "my-custom-popup"
        },
        preConfirm: () => {
          const nama = document.getElementById("nama").value.trim();
          const harga = Number(document.getElementById("harga").value);
          const deskripsi = document.getElementById("deskripsi").value.trim();
          const category = document.getElementById("category").value;
          const file = document.getElementById("gambar").files[0];

          if (!nama || !harga || !deskripsi) {
            Swal.showValidationMessage("Nama, harga, dan deskripsi wajib diisi.");
            return false;
          }

          return { nama, harga, deskripsi, category, gambar: file || null };
        }
      });

      if (formValues) {
        this.processSubmit(formValues, "PUT", `/products/${produk.id}`);
      }
    },
    async processSubmit(formValues, method, url) {
      const formData = new FormData();
      formData.append("name", formValues.nama);
      formData.append("description", formValues.deskripsi);
      formData.append("price", formValues.harga);
      formData.append("category", formValues.category);

      if (formValues.gambar) formData.append("image", formValues.gambar);
      if (method === "PUT") formData.append("_method", "PUT");

      try {
        await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        Swal.fire({
          icon: "success",
          title: "Data berhasil disimpan",
          timer: 1400,
          showConfirmButton: false
        });

        this.fetchProduk();
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
      }
    },
    async hapusProduk(produk) {
      Swal.fire({
        title: "Hapus produk?",
        text: `Kamu yakin ingin menghapus ${produk.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.delete(`/products/${produk.id}`);
            Swal.fire({
              icon: "success",
              title: "Produk dihapus",
              timer: 1200,
              showConfirmButton: false
            });
            this.fetchProduk();
          } catch (error) {
            Swal.fire("Gagal", "Terjadi kesalahan.", "error");
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.products-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 24px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.admin-product-card {
  padding: 18px;
  display: grid;
  gap: 16px;
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 24px;
}

.product-copy {
  display: grid;
  gap: 12px;
}

.meta-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
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

.product-copy h2,
.product-copy p {
  margin: 0;
}

.product-copy h2 {
  font-family: var(--font-display);
  font-size: 1.15rem;
}

.product-copy p {
  color: var(--muted);
  line-height: 1.7;
}

.card-actions {
  justify-content: space-between;
}

.action-btn {
  min-width: 110px;
}

.delete-btn {
  color: #dc2626;
}

@media (max-width: 640px) {
  .products-content {
    padding-bottom: 48px;
  }

  .card-actions {
    width: 100%;
  }
}
</style>
