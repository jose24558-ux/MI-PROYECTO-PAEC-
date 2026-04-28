const http = require('http');
const mariadb = require('mariadb');

// Conexión corregida para Render -> Railway
const pool = mariadb.createPool({
     host: 'switchback.proxy.rlwy.net', 
     user: 'root', 
     password: 'GNTTcpsuIMgNJGKIbFwlA0ANTKseHMrr',
     port: 27998, 
     database: 'railway',
     connectTimeout: 40000
});

const servidor = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/favicon.ico') return res.end(); 

    let conn;
    try {
        conn = await pool.getConnection();
        const filas = await conn.query("SELECT * FROM usuarios");
        res.end(JSON.stringify({ status: "OK", datos: filas }));
    } catch (err) {
        res.end(JSON.stringify({ status: "Error", detalle: err.message }));
    } finally {
        if (conn) conn.release(); 
    }
});

const PORT = process.env.PORT || 3000;
servidor.listen(PORT, () => {
    console.log(`>>> SERVIDOR FUNCIONANDO EN PUERTO ${PORT}`);
});
