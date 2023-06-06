# Menggunakan image Node.js versi 14 sebagai base image
FROM node:14

# Menentukan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Menginstal dependensi dari package.json
RUN npm install

# Menyalin kode aplikasi ke direktori kerja
COPY . .

# Menjalankan perintah build untuk aplikasi Express.js
RUN npm run build

# Menentukan port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Menjalankan perintah untuk menjalankan aplikasi saat kontainer dimulai
CMD [ "npm", "start" ]
