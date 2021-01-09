const express = require('express');
const router = express.Router();
// importar lo importante
const Cliente = require ('../models/Cliente');
const Colaborador = require ('../models/Colaborador');
const Maquina = require ('../models/Maquina');
const { veriToken, checkRole } = require ("../utils/auth");

router.get('/listacolaboradores', veriToken, checkRole(['Supervisor','Administrador']), (req, res, next)=> {
  Colaborador.find({rol:'Estandar'})
    .then((colaboradores)=>{
        if(colaboradores.length){
          colaboradores = colaboradores.map((item,index)=>{
            const sindata = item.toObject();
            delete sindata.password
            delete sindata.createdAt
            delete sindata.updatedAt
            delete sindata.email
            delete sindata.horario_entrada
            delete sindata.horario_salida
            delete sindata.estatus
            delete sindata.rol
            return sindata
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
  Maquina.find({estado:'Activa'})
    .then((maquinas)=>{
      if(maquinas.length){
        maquinas = maquinas.map((item,index)=>{
          const sindata = item.toObject();
          delete sindata.capacidad
          delete sindata.createdAt
          delete sindata.updatedAt
          delete sindata.estado
          delete sindata._colaborador
          return sindata
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
          const sindata = item.toObject();
          delete sindata.año_de_ingreso
          delete sindata._pedido
          delete sindata.updatedAt
          delete sindata.createdAt
          return sindata
         }
        )
      }
        res.status(200).json({result:clientes})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});
module.exports = router;