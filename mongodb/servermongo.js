// server.js (STRUKTUR YANG BENAR)

// ===================================
// 1. IMPORTS (CommonJS Murni)
// ===================================
// NOTE: Semua baris ini menggunakan require()
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Movie = require('./models/Movie'); 
const Director = require('./models/Director'); // Pastikan path benar!

// ===================================
// 2. SETUP & MIDDLEWARE
// ===================================
const app = express();
const PORT = process.env.PORT || 3300; 

app.use(cors());
app.use(express.json());

// ===================================
// 3. RUTE (CRUD untuk Movie dan Director)
// Rute harus didefinisikan DI SINI (di luar startServer)
// ===================================
// GET /movies - Menggunakan Mongoose find()
app.get('/movies', async (req, res, next) => { // Tambahkan next untuk error handler
    try {
        const movies = await Movie.find({}); // Movie.find({}) mengambil semua dokumen
        res.json(movies);
    } catch (err) {
        next(err); // Teruskan error ke error handler
    }
});

// GET /movies/:id - Menggunakan Mongoose findById()
app.get('/movies/:id', async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id); // Cari berdasarkan ID

        if (!movie) {
            return res.status(404).json({ error: 'Film tidak ditemukan' }); // 404 jika tidak ada
        }

        res.json(movie);
    } catch (err) {
        // Penanganan error jika format ID tidak valid (bukan ObjectId)
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});

// PUT /movies/:id - Menggunakan Mongoose findByIdAndUpdate()
app.put('/movies/:id', async (req, res, next) => {
    try {
        // Hanya ambil field yang diizinkan untuk diupdate
        const { title, director, year } = req.body;
        
        // Cek data wajib
        if (!title || !director || !year) {
            return res.status(400).json({ error: 'title, director, year wajib diisi' });
        } 

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, director, year }, // Data yang diupdate
            { new: true, runValidators: true } // Opsi: mengembalikan dokumen yang baru dan menjalankan validasi
        );

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Film tidak ditemukan' });
        }

        res.json(updatedMovie);

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});

// DELETE /movies/:id - Menggunakan Mongoose findByIdAndDelete()
app.delete('/movies/:id', async (req, res, next) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

        if (!deletedMovie) {
            return res.status(404).json({ error: 'Film tidak ditemukan' });
        }

        // Respon 204 No Content untuk penghapusan yang sukses
        res.status(204).send(); 
        
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});

// --- RUTE CRUD /directors (Tugas Bab 3) ---

// POST /directors (Create)
app.post('/directors', async (req, res, next) => {
    try {
        const { name, birthYear } = req.body; 
        const newDirector = new Director({ name, birthYear });
        const savedDirector = await newDirector.save();
        res.status(201).json(savedDirector);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        next(err); 
    }
});

// GET /directors (Read All)
app.get('/directors', async (req, res, next) => {
    try {
        const directors = await Director.find({});
        res.json(directors);
    } catch (err) { next(err); }
});

// GET /directors/:id (Read One)
app.get('/directors/:id', async (req, res, next) => {
    try {
        const director = await Director.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ error: 'Sutradara tidak ditemukan' });
        }
        res.json(director);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err); 
    }
});

// PUT /directors/:id (Update)
app.put('/directors/:id', async (req, res, next) => {
    try {
        const { name, birthYear } = req.body;
        if (!name || !birthYear) {
            return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
        }
        const updatedDirector = await Director.findByIdAndUpdate(
            req.params.id, { name, birthYear }, { new: true, runValidators: true }
        );
        if (!updatedDirector) {
            return res.status(404).json({ error: 'Sutradara tidak ditemukan' });
        }
        res.json(updatedDirector);
    } catch (err) {
        if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
            return res.status(400).json({ error: err.message || 'Format ID atau data tidak valid' });
        }
        next(err);
    }
});

// DELETE /directors/:id (Delete)
app.delete('/directors/:id', async (req, res, next) => {
    try {
        const deletedDirector = await Director.findByIdAndDelete(req.params.id);
        if (!deletedDirector) {
            return res.status(404).json({ error: 'Sutradara tidak ditemukan' });
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});


// ===================================
// 4. FALLBACK & ERROR HANDLER (WAJIB DITEMPATKAN PALING AKHIR)
// ===================================
app.use((req, res) => {
    res.status(404).json({ error: 'Rute tidak ditemukan' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});


// ===================================
// 5. FUNGSI ASYNC UNTUK START SERVER
// ===================================
const startServer = async () => {
    try {
        // PANGGILAN KONEKSI MONGODB DENGAN AWAIT DI SINI
        await connectDB();
        
        console.log(`MongoDB Terhubung.`);

        // MULAI MENDENGARKAN PORT SETELAH DB TERHUBUNG
        app.listen(PORT, () => {
            console.log(`Server aktif di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Gagal memulai server (Koneksi DB Gagal):", error.message);
        process.exit(1);
    }
};

// ===================================
// 6. JALANKAN FUNGSI UTAMA
// ===================================
startServer();