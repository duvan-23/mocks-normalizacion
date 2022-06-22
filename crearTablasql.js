import ClienteSQL1 from './sql1.js';
import { options1 } from './options/mysqlconn.js'

const sql = new ClienteSQL1(options1)

try{
    await sql.crearTabla();
    console.log("1-Tabla productos creada");
} catch(error){
    console.log(error);
} finally {
    sql.close();
}