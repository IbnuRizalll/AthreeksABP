<template>
  <div class="history-admin page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks Admin</div>
      <div class="nav-links">
        <button class="secondary-btn" @click="$router.push('/dashboard-admin')">Dashboard admin</button>
      </div>
    </header>

    <main class="shell-content history-content">
      <section class="history-header">
        <span class="section-eyebrow">Riwayat Penjualan</span>
        <h1 class="section-title">Pantau performa penjualan Athreeks per bulan dan per tahun.</h1>
      </section>

      <div v-if="isLoading" class="surface-card loading-state">Sedang memuat data history...</div>
      <div v-else-if="orders.length === 0" class="surface-card empty-state">Belum ada riwayat penjualan.</div>

      <template v-else>
        <section class="surface-card filters-card">
          <div class="field filter-field">
            <label for="tahun">Pilih Tahun</label>
            <select id="tahun" v-model="selectedYear" @change="updateBarChart">
              <option v-for="tahun in availableYears" :key="tahun" :value="tahun">
                {{ tahun }}
              </option>
            </select>
          </div>

          <div class="field filter-field">
            <label for="bulan">Pilih Bulan</label>
            <select id="bulan" v-model="selectedMonth" @change="updatePieChart">
              <option v-for="bulan in monthLabels" :key="bulan" :value="bulan">
                {{ bulan }}
              </option>
            </select>
          </div>
        </section>

        <section class="chart-grid">
          <article class="surface-card chart-card">
            <h2>Total Penjualan per Bulan ({{ selectedYear }})</h2>
            <canvas id="salesChart"></canvas>
          </article>

          <article class="surface-card chart-card">
            <h2>Rincian Produk ({{ selectedMonth }})</h2>
            <div class="pie-wrapper">
              <canvas id="pieChart"></canvas>
            </div>
          </article>
        </section>

        <section class="surface-card table-shell">
          <div class="section-head">
            <h2>Rincian Penjualan Bulan {{ selectedMonth }} {{ selectedYear }}</h2>
          </div>

          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Nama Pemesan</th>
                  <th>Pesanan</th>
                  <th>Total (Rp)</th>
                  <th>Status</th>
                  <th>Bulan</th>
                  <th>Tahun</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredOrders.length === 0">
                  <td colspan="7">Tidak ada penjualan di bulan ini.</td>
                </tr>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.nama }}</td>
                  <td>{{ order.pesanan.join(', ') }}</td>
                  <td>{{ order.total.toLocaleString('id-ID') }}</td>
                  <td><span class="status-pill">{{ order.status }}</span></td>
                  <td>{{ order.bulan }}</td>
                  <td>{{ order.tahun }}</td>
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
import { nextTick } from "vue";
import api from "@/api";
import Swal from "sweetalert2";
import {
  Chart,
  BarController,
  PieController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(BarController, PieController, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const BULAN_MAP = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

export default {
  name: "HistoryAdmin",
  data() {
    return {
      isLoading: true,
      selectedMonth: BULAN_MAP[new Date().getMonth()],
      selectedYear: new Date().getFullYear(),
      availableYears: [],
      barChart: null,
      pieChart: null,
      orders: [],
      monthLabels: BULAN_MAP,
      productColors: ["#dd5f3b", "#f59e0b", "#2563eb", "#16a34a"]
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter((o) => o.bulan === this.selectedMonth && o.tahun === this.selectedYear);
    }
  },
  async mounted() {
    await this.fetchOrders();

    if (this.orders.length > 0) {
      nextTick(() => {
        this.updateBarChart();
        this.updatePieChart();
      });
    }
  },
  methods: {
    async fetchOrders() {
      this.isLoading = true;
      try {
        const response = await api.get("/orders");
        const years = new Set();

        this.orders = response.data
          .filter((order) => order.status === "paid" || order.status === "completed")
          .map((order) => {
            const date = new Date(order.created_at);
            const year = date.getFullYear();
            const monthIndex = date.getMonth();
            years.add(year);

            const itemNames = (order.items || []).map((item) => item.product?.name ?? "Produk Dihapus");

            return {
              id: order.id,
              nama: order.user?.name ?? "User Dihapus",
              pesanan: itemNames,
              total: order.grand_total,
              status: this.translateStatus(order.status),
              bulan: BULAN_MAP[monthIndex],
              tahun: year
            };
          });

        this.availableYears = Array.from(years).sort((a, b) => b - a);

        if (this.availableYears.length > 0 && !this.availableYears.includes(this.selectedYear)) {
          this.selectedYear = this.availableYears[0];
        } else if (this.availableYears.length === 0) {
          this.availableYears = [this.selectedYear];
        }
      } catch (error) {
        console.error("Gagal memproses data history:", error);
        Swal.fire("Gagal", "Gagal memuat riwayat penjualan.", "error");
      } finally {
        this.isLoading = false;
      }
    },
    translateStatus(status) {
      if (status === "paid") return "Lunas";
      if (status === "completed") return "Selesai";
      return "Lainnya";
    },
    updateBarChart() {
      this.renderBarChart();
    },
    updatePieChart() {
      this.renderPieChart();
    },
    renderBarChart() {
      const canvas = document.getElementById("salesChart");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (this.barChart) this.barChart.destroy();

      const monthlyTotals = this.monthLabels.map((bulan) => {
        const orders = this.orders.filter((o) => o.bulan === bulan && o.tahun === this.selectedYear);
        return orders.reduce((sum, o) => sum + o.total, 0);
      });

      this.barChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.monthLabels,
          datasets: [
            {
              label: `Total Penjualan (${this.selectedYear})`,
              data: monthlyTotals,
              backgroundColor: "#dd5f3b",
              borderColor: "#c04f2f",
              borderWidth: 2,
              borderRadius: 10
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "#475467" }
            }
          },
          scales: {
            x: { ticks: { color: "#667085" }, grid: { display: false } },
            y: { ticks: { color: "#667085" } }
          }
        }
      });
    },
    renderPieChart() {
      const canvas = document.getElementById("pieChart");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (this.pieChart) this.pieChart.destroy();

      const orders = this.filteredOrders;
      const productCount = {};

      orders.forEach((order) => {
        order.pesanan.forEach((item) => {
          productCount[item] = (productCount[item] || 0) + 1;
        });
      });

      const topProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

      this.pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: topProducts.map((p) => p[0]),
          datasets: [
            {
              data: topProducts.map((p) => p[1]),
              backgroundColor: this.productColors,
              borderColor: "#fff",
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#475467", font: { size: 13 } }
            }
          }
        }
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

.filters-card {
  padding: 20px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-field {
  margin-bottom: 0;
  min-width: 220px;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
}

.chart-card,
.table-shell {
  padding: 22px;
}

.chart-card h2,
.section-head h2 {
  margin: 0 0 18px;
  font-family: var(--font-display);
  font-size: 1.2rem;
}

.pie-wrapper {
  position: relative;
  height: 280px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  background: rgba(237, 253, 243, 0.9);
  color: var(--success-600);
  font-weight: 800;
  font-size: 0.78rem;
}

@media (max-width: 960px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .history-content {
    padding-bottom: 48px;
  }

  .filters-card,
  .chart-card,
  .table-shell {
    padding: 18px;
  }

  .filter-field {
    min-width: 100%;
  }
}
</style>
