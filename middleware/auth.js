const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware Autentikasi (AuthN): Memverifikasi token dan melampirkan data user ke req.user
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token diperlukan. Akses ditolak.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            return res.status(403).json({ error: 'Token tidak valid atau kadaluarsa.' });
        }
        
        // Sekarang req.user akan berisi {id, username, role} karena kita
        // menyertakan 'role' saat login (Langkah 3 di server.js).
        req.user = decodedPayload.user; 
        next();
    });
}

// Middleware Autorisasi (AuthZ): Memeriksa apakah peran pengguna cocok dengan peran yang diizinkan
function authorizeRole(role) {
    // authorizeRole mengembalikan fungsi middleware
    return (req, res, next) => {
        // Middleware ini harus dijalankan SETELAH authenticateToken
        if (req.user && req.user.role === role) {
            next(); // Peran cocok, lanjutkan
        } else {
            // Pengguna terautentikasi, tetapi tidak memiliki izin
            return res.status(403).json({ 
                error: 'Akses Dilarang: Peran tidak memadai untuk operasi ini.',
                requiredRole: role 
            });
        }
    };
}

module.exports = {
    authenticateToken,
    authorizeRole
};