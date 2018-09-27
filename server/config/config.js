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
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//CREAR UNA VARIABLE DE ENTORNO EN HEROKU (CLI)
//heroku config:set <nombre_variable> = <valor>
//heroku config:get <nombre_variable>
//heroku config:unset <nombre_variable>