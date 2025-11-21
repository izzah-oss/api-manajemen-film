const mongoose = require('mongoose');

// Skema Director dengan properti name (String, required) dan birthYear (Number, required)
const directorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    birthYear: { 
        type: Number, 
        required: true 
    }
}, { 
    // Opsi: Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true 
});

// Membuat model dan mengekspornya
const Director = mongoose.model('Director', directorSchema);
module.exports = Director;
