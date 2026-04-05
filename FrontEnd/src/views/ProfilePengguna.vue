<template>
  <div class="profile-page page-shell">
    <header class="topbar">
      <div class="brand-mark">Athreeks</div>
      <div class="nav-links">
        <button class="secondary-btn" @click="$router.push('/dashboard-pembeli')">Kembali ke dashboard</button>
      </div>
    </header>

    <main class="shell-content profile-content">
      <section class="profile-header">
        <span class="section-eyebrow">Profil</span>
        <h1 class="section-title">Kelola identitas akunmu di halaman profil.</h1>
        <p class="section-copy">Perbarui nama, email, nomor telepon, dan foto profilmu bila diperlukan.</p>
      </section>

      <div v-if="isLoading" class="surface-card loading-state">Memuat profil...</div>

      <section v-else class="surface-card profile-card">
        <div class="profile-aside">
          <img :src="previewUrl" alt="Foto Pengguna" class="profile-photo" />
          <h2>{{ profil.nama }}</h2>
          <p>{{ profil.email }}</p>
          <span class="badge badge--success">Akun aktif</span>
        </div>

        <div class="profile-main">
          <div v-if="!editMode" class="info-grid">
            <article class="soft-card info-item">
              <span class="info-label">Nama</span>
              <strong>{{ profil.nama }}</strong>
            </article>
            <article class="soft-card info-item">
              <span class="info-label">Username</span>
              <strong>{{ profil.username }}</strong>
            </article>
            <article class="soft-card info-item">
              <span class="info-label">Email</span>
              <strong>{{ profil.email }}</strong>
            </article>
            <article class="soft-card info-item">
              <span class="info-label">No. Telepon</span>
              <strong>{{ profil.telepon || '-' }}</strong>
            </article>
          </div>

          <div v-else class="edit-form">
            <div class="field">
              <label for="foto">Ubah Foto Profil</label>
              <input id="foto" type="file" accept="image/*" @change="ubahFoto" />
            </div>

            <div class="field">
              <label for="nama">Nama</label>
              <input id="nama" v-model="profil.nama" />
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input id="email" v-model="profil.email" type="email" />
            </div>

            <div class="field">
              <label for="telepon">No. Telepon</label>
              <input id="telepon" v-model="profil.telepon" />
            </div>
          </div>

          <div class="cta-row profile-actions">
            <button v-if="!editMode" class="primary-btn" @click="editMode = true">Edit Profil</button>

            <template v-else>
              <button class="primary-btn" @click="konfirmasiSimpan" :disabled="isSaving">
                {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
              <button class="secondary-btn" @click="batalEdit" :disabled="isSaving">Batal</button>
            </template>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/api";

export default {
  name: "ProfilPengguna",
  data() {
    return {
      editMode: false,
      isLoading: true,
      isSaving: false,
      profil: {},
      profilAsli: {},
      fileToUpload: null,
      previewUrl: require("@/assets/OIP.jpeg")
    };
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      this.isLoading = true;
      try {
        const response = await api.get("/profile");
        const user = response.data;

        this.profil = {
          nama: user.name,
          username: user.username,
          email: user.email,
          telepon: user.telepon,
          foto: user.profile_photo_url
        };

        this.previewUrl = this.profil.foto || require("@/assets/OIP.jpeg");
        this.profilAsli = JSON.parse(JSON.stringify(this.profil));
      } catch (error) {
        Swal.fire("Error", "Gagal memuat profil.", "error");
        this.$router.push("/dashboard-pembeli");
      } finally {
        this.isLoading = false;
      }
    },
    ubahFoto(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileToUpload = file;
        this.previewUrl = URL.createObjectURL(file);
      }
    },
    konfirmasiSimpan() {
      Swal.fire({
        title: "Simpan perubahan?",
        text: "Pastikan semua data sudah benar.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, simpan"
      }).then((result) => {
        if (result.isConfirmed) {
          this.simpanPerubahan();
        }
      });
    },
    async simpanPerubahan() {
      this.isSaving = true;

      const formData = new FormData();
      formData.append("name", this.profil.nama);
      formData.append("email", this.profil.email);
      formData.append("telepon", this.profil.telepon || "");

      if (this.fileToUpload) {
        formData.append("image", this.fileToUpload);
      }

      try {
        const response = await api.post("/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        const user = response.data.user;
        this.profil = {
          nama: user.name,
          username: user.username,
          email: user.email,
          telepon: user.telepon,
          foto: user.profile_photo_url
        };

        this.previewUrl = this.profil.foto || require("@/assets/OIP.jpeg");
        this.profilAsli = JSON.parse(JSON.stringify(this.profil));
        this.fileToUpload = null;
        this.editMode = false;

        Swal.fire({
          title: "Berhasil disimpan",
          text: "Profil berhasil diperbarui.",
          icon: "success"
        });
      } catch (error) {
        let msg = "Terjadi kesalahan.";
        if (error.response && error.response.status === 422) {
          msg = "Email mungkin sudah digunakan oleh akun lain.";
        }
        Swal.fire("Gagal", msg, "error");
      } finally {
        this.isSaving = false;
      }
    },
    batalEdit() {
      this.profil = JSON.parse(JSON.stringify(this.profilAsli));
      this.previewUrl = this.profil.foto || require("@/assets/OIP.jpeg");
      this.fileToUpload = null;
      this.editMode = false;
    }
  }
};
</script>

<style scoped>
.profile-content {
  padding: 28px 0 72px;
  display: grid;
  gap: 24px;
}

.profile-header {
  display: grid;
  gap: 16px;
  max-width: 760px;
}

.profile-card {
  padding: 28px;
  display: grid;
  grid-template-columns: minmax(240px, 300px) 1fr;
  gap: 24px;
}

.profile-aside {
  padding: 20px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 243, 237, 0.85), rgba(255, 255, 255, 0.95));
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 999px;
  object-fit: cover;
  border: 5px solid rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-md);
}

.profile-aside h2,
.profile-aside p {
  margin: 0;
}

.profile-aside p {
  color: var(--muted);
}

.profile-main {
  display: grid;
  gap: 18px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.info-item {
  padding: 18px;
  display: grid;
  gap: 8px;
}

.info-label {
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.edit-form {
  display: grid;
  gap: 4px;
}

.profile-actions {
  margin-top: 4px;
}

@media (max-width: 900px) {
  .profile-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-content {
    padding-bottom: 48px;
  }

  .profile-card {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
