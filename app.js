require('dotenv').config();

const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');

const mongoose = require("mongoose");
const cors = require ('cors');



mongoose.connect(process.env.DB,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err)
  });


const app = express();
app.use (
  cors({
    origin:["http://localhost:3001","https://managertracker.herokuapp.com"],
    credentials: true,  
  })
)

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

//Rutas
const indexRouter = require("./routes/index");
const colaboradorRouter = require ("./routes/colaborador");
const clienteRouter = require("./routes/cliente");
const pedidoRouter = require("./routes/pedido");
const graficosRouter = require("./routes/graficos");
const maquinaRouter = require("./routes/maquina");
const adminRouter = require("./routes/admin")

app.use('/api', indexRouter);
app.use('/api/colaborador', colaboradorRouter)
app.use("/api/cliente",clienteRouter);
app.use("/api/pedido", pedidoRouter);
app.use("/api/graficos", graficosRouter);
app.use("/api/maquina", maquinaRouter);
app.use("/api/admin", adminRouter);

//esto es muy importante es para seguir en la ruta despues de actualizar
//podamos entrar a cualquier ruta
app.use("*", (req,res)=>{
  res.sendFile(path.join(__dirname, "public","index.html"));
 });

module.exports = app;
