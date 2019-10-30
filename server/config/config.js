// ============
// Server port
//  ==========

process.env.PORT = process.env.PORT || 3000;

// ============
// Environment  
//  ==========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============
// Token expiration
//  ==========
// 60 seconds
// 60 minutes
// 24 days
// 30 days
process.env.TOKEN_CADUCITY = 60 * 60 * 24 * 30;

// ============
// SEED AUTHENTICATION
//  ==========
process.env.SEED = process.env.SEED || 'this-is-the-development-seed';


// ============
// Database
//  ==========
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/nodejs-course';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;