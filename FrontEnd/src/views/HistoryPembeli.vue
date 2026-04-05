<template>
  <div class="history-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>
      <div class="nav-links">
        <router-link class="nav-link" to="/dashboard-pembeli">Dashboard</router-link>
      </div>
    </header>

    <main class="shell-content history-content">
      <section class="history-header">
        <span class="section-eyebrow">Riwayat Pesanan</span>
        <h1 class="section-title">Pantau status dan detail pesananmu dalam satu halaman.</h1>
        <p class="section-copy">Cek pesanan yang menunggu pembayaran, sedang diproses, atau sudah selesai.</p>
      </section>

      <div v-if="isLoading" class="surface-card loading-state">Sedang memuat riwayat pesanan...</div>
      <div v-else-if="allOrders.length === 0" class="surface-card empty-state">Kamu belum punya riwayat pesanan.</div>

      <div v-else class="history-columns">
        <section v-if="pendingOrders.length > 0" class="surface-card status-column">
          <div class="column-head">
            <h2>Menunggu Pembayaran</h2>
            <span class="badge badge--warning">{{ pendingOrders.length }} pesanan</span>
          </div>

          <div class="order-list">
            <article v-for="order in pendingOrders" :key="order.id" class="soft-card order-card">
              <div class="order-head">
                <div>
                  <h3>Pesanan #{{ order.id }}</h3>
                  <span>{{ formatTanggal(order.created_at) }}</span>
                </div>
                <span class="status-pill status-pill--pending">{{ translateStatus(order.status) }}</span>
              </div>

              <div class="item-list">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <img :src="item.product.image_url" alt="produk" class="item-img" />
                  <div>
                    <p class="item-name">{{ item.product.name }}</p>
                    <p class="item-meta">Jumlah {{ item.quantity }} - @ Rp{{ item.price.toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <strong>Rp{{ order.grand_total.toLocaleString() }}</strong>
                <button class="primary-btn small-btn" @click="bayarSekarang(order)">Lanjutkan pembayaran</button>
              </div>
            </article>
          </div>
        </section>

        <section v-if="processingOrders.length > 0" class="surface-card status-column">
          <div class="column-head">
            <h2>Sedang Dibuat</h2>
            <span class="badge badge--success">{{ processingOrders.length }} pesanan</span>
          </div>

          <div class="order-list">
            <article v-for="order in processingOrders" :key="order.id" class="soft-card order-card">
              <div class="order-head">
                <div>
                  <h3>Pesanan #{{ order.id }}</h3>
                  <span>{{ formatTanggal(order.created_at) }}</span>
                </div>
                <span class="status-pill status-pill--progress">{{ translateStatus(order.status) }}</span>
              </div>

              <div class="item-list">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <img :src="item.product.image_url" alt="produk" class="item-img" />
                  <div>
                    <p class="item-name">{{ item.product.name }}</p>
                    <p class="item-meta">Jumlah {{ item.quantity }} - @ Rp{{ item.price.toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <strong>Rp{{ order.grand_total.toLocaleString() }}</strong>
              </div>
            </article>
          </div>
        </section>

        <section v-if="completedOrders.length > 0" class="surface-card status-column">
          <div class="column-head">
            <h2>Selesai</h2>
            <span class="badge badge--success">{{ completedOrders.length }} pesanan</span>
          </div>

          <div class="order-list">
            <article v-for="order in completedOrders" :key="order.id" class="soft-card order-card">
              <div class="order-head">
                <div>
                  <h3>Pesanan #{{ order.id }}</h3>
                  <span>{{ formatTanggal(order.created_at) }}</span>
                </div>
                <span class="status-pill status-pill--done">{{ translateStatus(order.status) }}</span>
              </div>

              <div class="item-list">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <img :src="item.product.image_url" alt="produk" class="item-img" />
                  <div>
                    <p class="item-name">{{ item.product.name }}</p>
                    <p class="item-meta">Jumlah {{ item.quantity }} - @ Rp{{ item.price.toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <strong>Rp{{ order.grand_total.toLocaleString() }}</strong>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import api from "@/api";
import Swal from "sweetalert2";

export default {
  name: "HistoryPembeli",
  data() {
    return {
      activeOrders: [],
      historyOrders: [],
      isLoading: true
    };
  },
  mounted() {
    this.fetchOrders();
  },
  computed: {
    pendingOrders() {
      return this.activeOrders.filter((o) => o.status === "pending");
    },
    processingOrders() {
      return this.activeOrders.filter((o) => o.status === "paid");
    },
    completedOrders() {
      return this.historyOrders;
    },
    allOrders() {
      return this.activeOrders.concat(this.historyOrders);
    }
  },
  methods: {
    async fetchOrders() {
      this.isLoading = true;
      try {
        const [activeRes, historyRes] = await Promise.all([
          api.get("/orders/active"),
          api.get("/orders/history")
        ]);

        this.activeOrders = activeRes.data;
        this.historyOrders = historyRes.data;
      } catch (error) {
        console.error("Gagal memuat history:", error);
        Swal.fire("Gagal", "Gagal memuat riwayat pesanan.", "error");
      } finally {
        this.isLoading = false;
      }
    },
    translateStatus(status) {
      if (status === "pending") return "Menunggu Pembayaran";
      if (status === "paid") return "Sedang Dibuat";
      if (status === "completed") return "Selesai";
      return status;
    },
    formatTanggal(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    },
    bayarSekarang(order) {
      localStorage.setItem("paymentQrisUrl", order.qris_data_url);
      localStorage.setItem("paymentTotal", order.grand_total);

      Swal.fire({
        title: "Lanjutkan pembayaran",
        text: `Anda akan diarahkan untuk membayar pesanan #${order.id}.`,
        icon: "info"
      }).then(() => {
        this.$router.push("/pembayaran");
      });
    }
  }
};
</script>

<style scoped>
.history-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 24px;
}

.history-header {
  display: grid;
  gap: 16px;
  max-width: 820px;
}

.history-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
}

.status-column {
  padding: 22px;
  display: grid;
  gap: 16px;
}

.column-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.column-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
}

order-list {
  display: grid;
  gap: 16px;
}

.order-list {
  display: grid;
  gap: 16px;
}

.order-card {
  padding: 16px;
  display: grid;
  gap: 14px;
}

.order-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}

.order-head h3,
.order-head span,
.order-footer strong {
  margin: 0;
}

.order-head h3 {
  font-size: 1rem;
}

.order-head span {
  color: var(--muted);
  font-size: 0.84rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 800;
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

.item-list {
  display: grid;
  gap: 10px;
}

.order-item {
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 12px;
  align-items: center;
}

.item-img {
  width: 62px;
  height: 62px;
  border-radius: 16px;
  object-fit: cover;
}

.item-name,
.item-meta {
  margin: 0;
}

.item-name {
  font-weight: 700;
}

.item-meta {
  color: var(--muted);
  font-size: 0.86rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.small-btn {
  padding: 12px 16px;
}

@media (max-width: 640px) {
  .history-content {
    padding-bottom: 48px;
  }

  .status-column {
    padding: 18px;
  }
}
</style>
