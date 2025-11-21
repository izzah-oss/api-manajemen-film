const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    // Judul film (wajib diisi, tipe String, spasi di awal/akhir dihapus)
    title: { type: String, required: true, trim: true },
    
    // Sutradara (wajib diisi, tipe String, spasi di awal/akhir dihapus)
    director: { type: String, required: true, trim: true },
    
    // Tahun rilis (wajib diisi, tipe Number)
    year: { type: Number, required: true }
}, { 
    // Opsi: Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true 
});

// Membuat model dari skema
const Movie = mongoose.model('Movie', movieSchema);

// Mengekspor model agar bisa digunakan di file lain
module.exports = Movie;
// module.exports = Movie;