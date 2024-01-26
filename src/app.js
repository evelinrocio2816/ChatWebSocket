const express = require("express");
const app = express();
const PORT = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const viewRoutes = require("./routes/views.router.js");

app.use(express.static("./src/public"));

//Configuramos Motor de plantillas

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//routes
app.use("/", viewRoutes);


const httpServer= app.listen(PORT, () => {
  console.log(`Escuchando en elpuerto: http://localhost:${PORT}`);
});

//creamos una instancia teniendo como paramentro nuestro servidor

const io = new socket.Server(httpServer);
//creo un array que guare todos los mensajes de los participantes
let messages = [];

//Establecemos la conexion
//io es la instancia de socket.io
//on es el metodo para escuchar
//El primer parametro es el evento que queremos escuchar
//El segundo es un callback que se va a ejecutar cuando se emita el evento.
//El callback recibe como parametro los datos que envian los clientes

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", data => {
    messages.push(data);
    io.emit("messagesLogs", messages);
    //con emit , emitimos eventos desde el servidor al cliente
  })
})
