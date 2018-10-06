//==============================
//PUERTO
//==============================
process.env.PORT = process.env.PORT || 3000

//==============================
//ENTORNO
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============================
//Vencimiento token
//==============================
//60 segundos, 60 minutos, 24 Horas, 30 Dias
process.env.VENCIMIENTO_TOKEN = '48h';

//==============================
//SEED de autenticacion 
//==============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-develop';
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

//==============================
//Google client ID
//==============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1037194527497-fricon5s6sg4akpot4k5j601d3c8j5s5.apps.googleusercontent.com';

//CREAR UNA VARIABLE DE ENTORNO EN HEROKU (CLI)
//heroku config:set <nombre_variable> = <valor>
//heroku config:get <nombre_variable>
//heroku config:unset <nombre_variable>