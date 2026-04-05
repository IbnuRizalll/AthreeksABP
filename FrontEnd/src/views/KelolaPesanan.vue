<template>
  <div class="admin-orders page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks Admin</div>

      <div class="nav-links">
        <button class="secondary-btn" @click="$router.push('/dashboard-admin')">Dashboard admin</button>
      </div>
    </header>

    <main class="shell-content orders-content">
      <section class="orders-header">
        <span class="section-eyebrow">Pesanan</span>
        <h1 class="section-title">Pemrosesan pesanan pelanggan.</h1>
      </section>

      <div v-if="isLoading" class="surface-card loading-state">Sedang memuat data pesanan...</div>

      <template v-else>
        <section class="surface-card table-shell">
          <div class="section-head">
            <h2>Menunggu Pembayaran</h2>
            <span class="badge badge--warning">{{ sedangDibuat.length }} pesanan</span>
          </div>

          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Pemesan</th>
                  <th>No. Telepon</th>
                  <th>Alamat</th>
                  <th>Pesanan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="sedangDibuat.length === 0">
                  <td colspan="8">Tidak ada pesanan yang menunggu pembayaran.</td>
                </tr>
                <tr v-for="p in sedangDibuat" :key="p.id">
                  <td>#{{ p.id }}</td>
                  <td>{{ p.user.name }}</td>
                  <td>{{ p.user.telepon || '-' }}</td>
                  <td class="address-cell">{{ p.alamat_pengiriman || '-' }}</td>
                  <td>
                    <ul class="order-list">
                      <li v-for="item in p.items" :key="item.id">{{ item.product.name }} - {{ item.quantity }} pcs</li>
                    </ul>
                  </td>
                  <td>Rp{{ p.grand_total.toLocaleString() }}</td>
                  <td><span class="status-pill status-pill--pending">{{ p.status }}</span></td>
                  <td>
                    <select v-model="p.status" @change="ubahStatus(p)">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="surface-card table-shell">
          <div class="section-head">
            <h2>Siap Diproses</h2>
            <span class="badge badge--success">{{ sedangDiantar.length }} pesanan</span>
          </div>

          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Pemesan</th>
                  <th>No. Telepon</th>
                  <th>Alamat</th>
                  <th>Pesanan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="sedangDiantar.length === 0">
                  <td colspan="8">Tidak ada pesanan yang siap diproses.</td>
                </tr>
                <tr v-for="p in sedangDiantar" :key="p.id">
                  <td>#{{ p.id }}</td>
                  <td>{{ p.user.name }}</td>
                  <td>{{ p.user.telepon || '-' }}</td>
                  <td class="address-cell">{{ p.alamat_pengiriman || '-' }}</td>
                  <td>
                    <ul class="order-list">
                      <li v-for="item in p.items" :key="item.id">{{ item.product.name }} - {{ item.quantity }} pcs</li>
                    </ul>
                  </td>
                  <td>Rp{{ p.grand_total.toLocaleString() }}</td>
                  <td><span class="status-pill status-pill--progress">{{ p.status }}</span></td>
                  <td>
                    <select v-model="p.status" @change="ubahStatus(p)">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="surface-card table-shell">
          <div class="section-head">
            <h2>Selesai</h2>
            <span class="badge badge--success">{{ selesai.length }} pesanan</span>
          </div>

          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Pemesan</th>
                  <th>No. Telepon</th>
                  <th>Alamat</th>
                  <th>Pesanan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="selesai.length === 0">
                  <td colspan="8">Belum ada pesanan yang selesai.</td>
                </tr>
                <tr v-for="p in selesai" :key="p.id">
                  <td>#{{ p.id }}</td>
                  <td>{{ p.user.name }}</td>
                  <td>{{ p.user.telepon || '-' }}</td>
                  <td class="address-cell">{{ p.alamat_pengiriman || '-' }}</td>
                  <td>
                    <ul class="order-list">
                      <li v-for="item in p.items" :key="item.id">{{ item.product.name }} - {{ item.quantity }} pcs</li>
                    </ul>
                  </td>
                  <td>Rp{{ p.grand_total.toLocaleString() }}</td>
                  <td><span class="status-pill status-pill--done">{{ p.status }}</span></td>
                  <td>
                    <select v-model="p.status" @change="ubahStatus(p)">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "KelolaPesanan",
  data() {
    return {
      pesananList: [],
      isLoading: false
    };
  },
  mounted() {
    this.fetchPesanan();
  },
  computed: {
    sedangDibuat() {
      return this.pesananList.filter((p) => p.status === "pending");
    },
    sedangDiantar() {
      return this.pesananList.filter((p) => p.status === "paid");
    },
    selesai() {
      return this.pesananList.filter((p) => p.status === "completed");
    }
  },
  methods: {
    async fetchPesanan() {
      this.isLoading = true;
      try {
        const response = await api.get("/orders");
        this.pesananList = response.data;
      } catch (error) {
        console.error("Gagal memuat pesanan:", error);
        Swal.fire({
          title: "Error",
          text: "Gagal memuat data pesanan dari server.",
          icon: "error"
        });
      } finally {
        this.isLoading = false;
      }
    },
    async ubahStatus(pesanan) {
      Swal.fire({
        title: "Ubah status?",
        text: `Yakin ingin mengubah status pesanan #${pesanan.id} menjadi "${pesanan.status}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, ubah"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.put(`/orders/${pesanan.id}`, {
              status: pesanan.status
            });

            Swal.fire({
              title: "Berhasil",
              text: "Status pesanan telah diperbarui.",
              icon: "success",
              timer: 1400,
              showConfirmButton: false
            });

            this.fetchPesanan();
          } catch (error) {
            console.error("Gagal mengubah status:", error);
            Swal.fire("Gagal", "Terjadi kesalahan saat mengubah status.", "error");
            this.fetchPesanan();
          }
        } else {
          this.fetchPesanan();
        }
      });
    }
  }
};
</script>

<style scoped>
.orders-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 24px;
}

.orders-header {
  display: grid;
  gap: 16px;
  max-width: 820px;
}

.table-shell {
  padding: 22px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.section-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.22rem;
}

.address-cell {
  min-width: 220px;
  white-space: pre-wrap;
}

.order-list {
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: capitalize;
}

.status-pill--pending {
  background: var(--warning-50);
  color: var(--warning-600);
}

.status-pill--progress {
  background: rgba(224, 242, 254, 0.9);
  color: #0369a1;
}

.status-pill--done {
  background: var(--success-50);
  color: var(--success-600);
}

select {
  min-width: 140px;
  border: 1px solid var(--border);
  background: rgba(248, 250, 252, 0.8);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
}

@media (max-width: 640px) {
  .orders-content {
    padding-bottom: 48px;
  }

  .table-shell {
    padding: 18px;
  }
}
</style>
