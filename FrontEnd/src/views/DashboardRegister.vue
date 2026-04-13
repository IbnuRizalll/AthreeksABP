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

          <!-- PASSWORD FIELD WITH EYE ICON -->
          <div class="field">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :class="passwordClass"
                placeholder="Minimal 8 karakter"
                required
              />
              <button type="button" class="eye-toggle" @click="showPassword = !showPassword" tabindex="-1">
                <!-- Icon Mata Terbuka (Show) -->
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <!-- Icon Mata Tertutup (Hide) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <small :class="passwordHintClass">{{ passwordHint }}</small>
          </div>

          <!-- CONFIRM PASSWORD FIELD WITH EYE ICON -->
          <div class="field">
            <label for="confirm">Konfirmasi Password</label>
            <div class="password-wrapper">
              <input
                id="confirm"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Ulangi password"
                required
              />
              <button type="button" class="eye-toggle" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                <!-- Icon Mata Terbuka (Show) -->
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <!-- Icon Mata Tertutup (Hide) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
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
      isLoading: false,
      showPassword: false,      // BARU: Kontrol show/hide password
      showConfirmPassword: false // BARU: Kontrol show/hide konfirmasi password
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

/* === STYLE ICON MATA === */
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 44px; /* Ruang agar teks tidak tertutup icon */
}

.eye-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--muted, #6b7280);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.2s;
}

.eye-toggle:hover {
  color: var(--brand, #d65a31);
}
/* =================== */

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