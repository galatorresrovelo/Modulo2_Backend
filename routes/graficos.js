const express = require('express');
const router  = express.Router();

const Pedido = require ('../models/Pedido');
const Maquina = require ('../models/Maquina');
const { veriToken, checkRole } = require ("../utils/auth");

//todas los pedidos
router.get('/grafpedidos', veriToken, checkRole(["Administrador", "Supervisor"]), (req, res, next)=> {
   Pedido.find()
   .populate({ // <---- agegar todo este para hacer un populate aninado
     path:"_colaborador",
     select:"nombre",
     populate:{
         path:"_maquina",
         select: "modelo",
     },
 })
 .populate ("_cliente", "nombre")
     .then((pedidos)=>{
         res.status(200).json({result:pedidos})
     })
     .catch((error)=>{
         res.status(400).json({msg:"Algo salió mal", error})
     })
 });
 

 //todas maquinas
router.get('/grafmaquina', veriToken, checkRole(["Administrador", "Supervisor"]), (req, res, next)=> {
   Maquina.find()
     .then((maquinas)=>{
         res.status(200).json({result:maquinas})
     })
     .catch((error)=>{
         res.status(400).json({msg:"Algo salió mal", error})
     })
 });
 
 module.exports = router;