import ClienteSQL from './sql.js';
import { options } from './options/sqlite.js'
import ClienteSQL1 from './sql1.js';
import { options1 } from './options/mysqlconn.js'
import { faker } from '@faker-js/faker';
import ContenedorMongoDb from './ContenedorMongoDb.js';
// const { normalize, denormalize, schema } = require('normalizr');
import { normalize, denormalize, schema } from 'normalizr';
import util from 'util';
faker.locale = 'es';
const sql1 = new ClienteSQL1(options1);
const contenedorMongo = new ContenedorMongoDb("mensajes");
const sql = new ClienteSQL(options);

import express from 'express';

import { createServer } from "http";

import { Server } from "socket.io";

function createRandomProject(id) {
    return {
        id: id,
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(1000, 1000000, 0, '$'),
        foto: faker.image.business(150,150, true)
    }
}


const app = express()

const httpServer = new createServer(app)
const io = new Server(httpServer)


app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))
app.set('views', './public')

app.set('view engine', 'pug')

await contenedorMongo.conectar();
app.get('/', (req, res) => {
    // res.sendFile('index.pug', {root: __dirname})
    res.render('./views/mensajes')
})
app.get('/api/productos-test', (req, res) => {
    const cant = 5;
    const productos = Array.from(new Array(cant), (v, i) => createRandomProject(i + 1))
    res.render('./views/productosFake',{productos:productos})
})
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado!')
    let mensajes;
    // socket.emit('messages', messages)
    // socket.emit('messages', await contenedorMensajes.getAll())

    //normalizr 
    const user = new schema.Entity('users');

    const comment = new schema.Entity('comments', {
        commenter: user
    })

    const post = new schema.Entity('posts', {
        author: user,
        comments: [comment]
    })

    const blog = new schema.Entity('blog', {
        posts: [post]
    })


        

    function print(objeto) {
        console.log(util.inspect(objeto,false,12,true))
    }
    const consulta =await contenedorMongo.listarMensajes();
    const datos ={
        id: "10000",
        posts:consulta
    }
    console.log('Objeto normalizado')
    const normalizedHolding = normalize(datos, blog)
    print(normalizedHolding)
    // Porcentaje de reduccion
    // console.log('Porcentaje de reduccion')
    // console.log(100 - ((JSON.stringify(normalizedHolding).length * 100) / JSON.stringify(datos).length))


    // console.log('Objeto denormalizado')
    // const denormalizedHolding = denormalize(normalizedHolding.result, blog, normalizedHolding.entities)
    // print(denormalizedHolding)

    socket.emit('messages', normalizedHolding)

    socket.on('new-message', async data => {
        let mensajes;
        await contenedorMongo.insertarMensajes(data);
        // await contenedorMongo.insertarMensajes(data);
        const consulta =await contenedorMongo.listarMensajes();
        const user = new schema.Entity('users');

    const comment1 = new schema.Entity('comments', {
        commenter: user
    })

    const post1 = new schema.Entity('posts', {
        author: user,
        comments: [comment1]
    })

    const blog1 = new schema.Entity('blog', {
        posts: [post1]
    })
        const datos1 ={
            id: "10000",
            posts:consulta
        }
        console.log('Objeto origen')
        print(datos1)
        
        console.log('Objeto normalizado')
        const normalizedHolding1 = normalize(datos1, blog1)
        print(normalizedHolding1)

        io.sockets.emit('messages', normalizedHolding1)
    })
    // socket.emit('products', productos)
    socket.emit('products', await sql1.listarProductos())

    socket.on('new-product', async data => {
        // productos.push(data)
        await sql1.insertarProductos(data);
        io.sockets.emit('products',  await sql1.listarProductos())
    })
})

const PORT = process.env.PORT || 8080

httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))