import ClienteSQL from './sql.js';
import { options } from './options/sqlite.js'

const sql = new ClienteSQL(options)

try{
    await sql.crearTabla();
    console.log("1-Tabla mensajes creada");
} catch(error){
    console.log(error);
} finally {
    sql.close();
}