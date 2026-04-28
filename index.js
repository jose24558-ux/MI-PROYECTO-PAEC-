const http = require('http');
const mariadb = require('mariadb');

// Configuración de la conexión
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     port: 3307,        
     user: 'geo_dev',   
     password: '',      
     database: 'test',  
     connectionLimit: 5
});

const servidor = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/favicon.ico') return res.end(); 

    let conn;
    try {
        console.log("Intentando obtener conexión...");
        conn = await pool.getConnection();
        console.log("Conexión obtenida. Consultando tabla usuarios...");
        
        // Consultamos la tabla que creaste en HeidiSQL
        const filas = await conn.query("SELECT * FROM usuarios");
        
        res.end(JSON.stringify({ 
            status: "OK", 
            datos: filas 
        }));
        
    } catch (err) {
        console.log("Error detallado:", err);
        res.end(JSON.stringify({ status: "Error", detalle: err.message }));
    } finally {
        if (conn) conn.release(); // Muy importante liberar la conexión
    }
});

servidor.listen(3000, () => {
    console.log(">>> SERVIDOR ACTIVO EN http://localhost:3000");
});