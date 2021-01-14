const express = require('express');
const router = express.Router();
// importar lo importante
const Cliente = require ('../models/Cliente');
const Colaborador = require ('../models/Colaborador');
const Maquina = require ('../models/Maquina');
const Pedido = require ('../models/Pedido')
const { veriToken, checkRole } = require ("../utils/auth");

router.get('/listacolaboradores', veriToken, checkRole(['Supervisor','Administrador']), (req, res, next)=> {
  Colaborador.find({rol:'Estandar'}).populate('_maquina')
    .then((colaboradores)=>{
        if(colaboradores.length){
          colaboradores = colaboradores.map((item,index)=>{
            const data = item.toObject();
            return data
           }
          )
        }
        res.status(200).json({result:colaboradores})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});

router.get('/listamaquinas', veriToken, checkRole(['Supervisor','Administrador']), (req, res, next)=> {
  Maquina.find({estado:'Activa'}).populate('_colaborador')
    .then((maquinas)=>{
      if(maquinas.length){
        maquinas = maquinas.map((item,index)=>{
          const data = item.toObject();
          return data
         }
        )
      }
        res.status(200).json({result:maquinas})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});

router.get('/listaclientes', veriToken, checkRole(['Supervisor','Administrador']), (req, res, next)=> {
  Cliente.find()
    .then((clientes)=>{
      if(clientes.length){
        clientes = clientes.map((item,index)=>{
          const data = item.toObject();
          return data
         }
        )
      }
        res.status(200).json({result:clientes})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});

router.get('/listapedidos', veriToken, checkRole(['Supervisor','Administrador']), (req, res, next)=> {
  Pedido.find().populate('_cliente').populate('_colaborador')
    .then((pedidos)=>{
      if(pedidos.length){
        pedidos = pedidos.map((item,index)=>{
          const data = item.toObject();
          return data
         }
        )
      }
        res.status(200).json({result:pedidos})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});
module.exports = router;