// Memuat variabel lingkungan dari file .env
require('dotenv').config();

// Mengimpor library Mongoose untuk interaksi dengan MongoDB
const mongoose = require('mongoose');

/**
 * Fungsi asinkron untuk menghubungkan ke database MongoDB.
 */
const connectDB = async () => {
    try {
        // Mencoba koneksi menggunakan URI dari variabel lingkungan
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Pesan sukses jika koneksi berhasil
        console.log(`MongoDB Terhubung: ${conn.connection.host}`);
    } catch (error) {
        // Pesan eror jika koneksi gagal
        console.error(`Error Koneksi DB: ${error.message}`);
        
        // Menghentikan proses dengan kode eror (1)
        process.exit(1);
    }
};

// Mengekspor fungsi connectDB agar dapat digunakan di file lain (misalnya, di file server/index.js)
module.exports = connectDB;