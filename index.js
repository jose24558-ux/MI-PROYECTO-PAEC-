const http = require('http');
const mariadb = require('mariadb');

// CONFIGURACIÓN DEFINITIVA
const pool = mariadb.createPool({
     // Usamos la URL completa que nos da Railway
     host: 'switchback.proxy.rlwy.net', 
     user: 'root', 
     password: 'GNTTcpsuIMgNJGKIbFwlA0ANTKseHMrr',
     port: 3306, 
     database: 'railway',
     connectionLimit: 5,
     connectTimeout: 30000, // 30 segundos para conectar
     allowPublicKeyRetrieval: true
});

const servidor = http.createServer(async (req, res) => {
    // Permisos para que tu HTML pueda leer los datos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/favicon.ico') return res.end(); 

    let conn;
    try {
        conn = await pool.getConnection();
        // IMPORTANTE: USUARIOS en mayúsculas como lo tienes en Railway
        const filas = await conn.query("SELECT * FROM USUARIOS");
        res.end(JSON.stringify({ status: "OK", datos: filas }));
    } catch (err) {
        res.end(JSON.stringify({ 
            status: "Error", 
            mensaje: "No se pudo conectar a la base de datos",
            error: err.message 
        }));
    } finally {
        if (conn) conn.release(); 
    }
});

const PORT = process.env.PORT || 3000;
servidor.listen(PORT, () => {
    console.log(`Servidor listo en puerto ${PORT}`);
});
