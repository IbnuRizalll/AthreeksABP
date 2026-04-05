# Instalasi & Setup
Clone Repository
git clone https://github.com/IbnuRizalll/AthreeksABP.git

# Setup Backend (Laravel)

cd BackEnd
composer install
cp .env.example .env
php artisan key:generate

# Konfigurasi Database di .env
DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=root
DB_PASSWORD=

# Jalankan Migration
php artisan migrate

# Jalankan Server
php artisan serve

# Setup Frontend (Vue)

cd FrontEnd
npm install

# Buat file .env 
cp .env.example .env
isi 
VUE_APP_API_URL=http://127.0.0.1:8000/api

# Jalankan Server
npm run dev

