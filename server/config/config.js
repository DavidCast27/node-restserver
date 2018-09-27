//==============================
//PUERTO
//==============================
process.env.PORT = process.env.PORT || 3000

//==============================
//ENTORNO
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============================
//DB
//==============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:1234qwer@ds051635.mlab.com:51635/cafe-node';
}
// urlDB = 'mongodb://cafe-user:Apolo1618@ds051635.mlab.com:51635/cafe-node';
process.env.URLDB = urlDB;