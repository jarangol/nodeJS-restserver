// ============
// Server port
//  ==========

process.env.PORT = process.env.PORT || 3000;

// ============
// Environment  
//  ==========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============
// Database
//  ==========
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/nodejs-course';
} else {
    urlDB = 'mongodb+srv://julian:fTaJ9eH6osDgHGAq@cluster0-v4mmy.mongodb.net/test?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;