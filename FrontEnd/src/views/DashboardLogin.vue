<template>
  <div class="auth-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>

      <div class="nav-links">
        <button class="ghost-btn auth-link" @click="$router.push('/')">Beranda</button>
        <button class="secondary-btn auth-link" @click="$router.push('/registrasi')">Daftar</button>
      </div>
    </header>

    <main class="shell-content auth-layout">
      <section class="auth-copy">
        <span class="section-eyebrow">Masuk</span>
        <h1 class="section-title">Masuk untuk melanjutkan belanja dan mengelola pesananmu.</h1>
        <p class="section-copy">
          Gunakan akunmu untuk mengakses keranjang, pembayaran, dan riwayat pesanan dengan lebih mudah.
        </p>

        <div class="auth-highlights">
          <article class="soft-card highlight-card">
            <strong>Akses cepat</strong>
            <span>Lanjutkan belanja dan cek pesanan dalam satu akun.</span>
          </article>
          <article class="soft-card highlight-card">
            <strong>Data tersimpan</strong>
            <span>Informasi akun dan pesananmu tetap siap diakses saat dibutuhkan.</span>
          </article>
        </div>
      </section>

      <section class="surface-card form-card auth-card">
        <div class="card-head">
          <h2>Masuk ke Athreeks</h2>
          <p>Gunakan username dan password yang sudah terdaftar.</p>
        </div>

        <form @submit.prevent="login">
          <div class="field">
            <label for="username">Username</label>
            <input id="username" v-model="username" type="text" placeholder="Masukkan username" required />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input id="password" v-model="password" type="password" placeholder="Masukkan password" required />
          </div>

          <button type="submit" class="primary-btn submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Memproses...' : 'Masuk Sekarang' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Belum punya akun?</span>
          <button class="ghost-btn footer-link" @click="$router.push('/registrasi')">Buat akun baru</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "DashboardLogin",
  data() {
    return {
      username: "",
      password: "",
      isLoading: false
    };
  },
  methods: {
    async login() {
      this.isLoading = true;

      try {
        const response = await api.post("/login", {
          username: this.username,
          password: this.password
        });

        const token = response.data.access_token;
        const user = response.data.user;

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);

        Swal.fire({
          title: "Login berhasil",
          text: `Selamat datang kembali, ${user.name}.`,
          icon: "success",
          timer: 1400,
          showConfirmButton: false
        }).then(() => {
          if (user.role === "admin") {
            this.$router.push("/dashboard-admin");
          } else {
            this.$router.push("/dashboard-pembeli");
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Login gagal",
          text: "Username atau password salah.",
          icon: "error"
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-layout {
  padding: 34px 0 72px;
  display: grid;
  grid-template-columns: 1fr minmax(360px, 460px);
  gap: 32px;
  align-items: center;
}

.auth-copy {
  display: grid;
  gap: 22px;
}

.auth-highlights {
  display: grid;
  gap: 16px;
}

.highlight-card {
  padding: 18px 20px;
  display: grid;
  gap: 8px;
}

.highlight-card strong {
  font-family: var(--font-display);
}

.highlight-card span {
  color: var(--muted);
  line-height: 1.7;
}

.auth-card {
  display: grid;
  gap: 24px;
}

.card-head h2 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: 1.85rem;
}

.card-head p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  color: var(--muted);
}

.footer-link,
.auth-link {
  padding: 0;
}

@media (max-width: 960px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-layout {
    padding-bottom: 42px;
  }

  .auth-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
