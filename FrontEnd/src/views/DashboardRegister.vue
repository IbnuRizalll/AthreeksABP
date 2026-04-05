<template>
  <div class="auth-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>

      <div class="nav-links">
        <button class="ghost-btn auth-link" @click="$router.push('/')">Beranda</button>
        <button class="secondary-btn auth-link" @click="goBack" :disabled="isLoading">Login</button>
      </div>
    </header>

    <main class="shell-content register-layout">
      <section class="register-copy">
        <span class="section-eyebrow">Daftar</span>
        <h1 class="section-title">Buat akun pembeli untuk mulai memesan produk Athreeks.</h1>
        <p class="section-copy">
          Isi data diri dengan lengkap agar kamu bisa login, checkout, dan memantau pesanan dengan mudah.
        </p>

        <div class="register-notes">
          <article class="soft-card note-card">
            <strong>Data utama</strong>
            <span>Nama, username, email, telepon, dan password.</span>
          </article>
          <article class="soft-card note-card">
            <strong>Siap digunakan</strong>
            <span>Setelah daftar, kamu bisa langsung login dan mulai belanja.</span>
          </article>
        </div>
      </section>

      <section class="surface-card form-card register-card">
        <div class="card-head">
          <h2>Registrasi Pembeli</h2>
          <p>Lengkapi data berikut untuk membuat akun baru.</p>
        </div>

        <form @submit.prevent="registerManual" class="register-form">
          <div class="field">
            <label for="nama">Nama Lengkap</label>
            <input id="nama" v-model="nama" type="text" placeholder="Masukkan nama lengkap" required />
          </div>

          <div class="field two-column">
            <div>
              <label for="username">Username</label>
              <input id="username" v-model="username" type="text" placeholder="Masukkan username" required />
            </div>

            <div>
              <label for="telepon">Nomor Telepon</label>
              <input id="telepon" v-model="telepon" type="text" placeholder="Contoh: 08123456789" required />
            </div>
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" placeholder="Masukkan alamat email" required />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              :class="passwordClass"
              placeholder="Minimal 8 karakter"
              required
            />
            <small :class="passwordHintClass">{{ passwordHint }}</small>
          </div>

          <div class="field">
            <label for="confirm">Konfirmasi Password</label>
            <input
              id="confirm"
              v-model="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              required
            />
          </div>

          <div class="cta-row">
            <button type="submit" class="primary-btn submit-btn" :disabled="isLoading">
              {{ isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
            </button>
            <button type="button" class="secondary-btn" @click="goBack" :disabled="isLoading">Kembali ke Login</button>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "PembeliPage",
  data() {
    return {
      nama: "",
      email: "",
      username: "",
      telepon: "",
      password: "",
      confirmPassword: "",
      isLoading: false
    };
  },
  computed: {
    passwordClass() {
      if (this.password.length === 0) return "";
      return this.password.length >= 8 ? "valid-password" : "invalid-password";
    },
    passwordHint() {
      if (this.password.length === 0) return "";
      return this.password.length >= 8
        ? "Password sudah cukup kuat."
        : "Minimal 8 karakter.";
    },
    passwordHintClass() {
      return this.password.length >= 8 ? "hint-valid" : "hint-invalid";
    }
  },
  methods: {
    async registerManual() {
      if (this.isLoading) return;

      if (!this.nama || !this.email || !this.username || !this.telepon || !this.password || !this.confirmPassword) {
        Swal.fire({
          title: "Data belum lengkap",
          text: "Harap isi semua field terlebih dahulu.",
          icon: "error"
        });
        return;
      }

      if (this.password.length < 8) {
        Swal.fire({
          title: "Password terlalu pendek",
          text: "Minimal 8 karakter ya.",
          icon: "error"
        });
        return;
      }

      if (this.password !== this.confirmPassword) {
        Swal.fire({
          title: "Password tidak sama",
          text: "Pastikan password dan konfirmasi password cocok.",
          icon: "error"
        });
        return;
      }

      this.isLoading = true;

      try {
        await api.post("/register", {
          name: this.nama,
          email: this.email,
          username: this.username,
          telepon: this.telepon,
          password: this.password,
          password_confirmation: this.confirmPassword
        });

        Swal.fire({
          title: "Registrasi berhasil",
          html: `
            <p>Akun untuk <b>${this.nama}</b> berhasil dibuat.</p>
            <p style="margin-top:10px;">Silakan login untuk melanjutkan.</p>
          `,
          icon: "success",
          confirmButtonText: "Ke Login"
        }).then(() => {
          this.$router.push("/login");
        });
      } catch (error) {
        let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

        if (error.response && error.response.status === 422) {
          errorMessage = "Username, email, atau nomor telepon sudah digunakan.";
        }

        Swal.fire({
          title: "Registrasi gagal",
          text: errorMessage,
          icon: "error"
        });
      } finally {
        this.isLoading = false;
      }
    },
    goBack() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.register-layout {
  padding: 34px 0 72px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 32px;
  align-items: start;
}

.register-copy,
.register-card {
  display: grid;
  gap: 22px;
}

.register-notes {
  display: grid;
  gap: 16px;
}

.note-card {
  padding: 18px 20px;
  display: grid;
  gap: 8px;
}

.note-card strong {
  font-family: var(--font-display);
}

.note-card span {
  color: var(--muted);
  line-height: 1.7;
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

.register-form {
  display: grid;
  gap: 2px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.two-column > div {
  display: grid;
  gap: 8px;
}

small {
  color: var(--muted);
  min-height: 20px;
}

.hint-valid {
  color: var(--success-600);
}

.hint-invalid {
  color: #dc2626;
}

.valid-password {
  border-color: rgba(22, 163, 74, 0.55) !important;
}

.invalid-password {
  border-color: rgba(220, 38, 38, 0.55) !important;
}

.submit-btn {
  min-width: 220px;
}

.auth-link {
  padding: 0;
}

@media (max-width: 960px) {
  .register-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .register-layout {
    padding-bottom: 42px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
