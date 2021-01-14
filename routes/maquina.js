const express = require('express');
const router  = express.Router();

// importar lo importante
const Maquina = require ('../models/Maquina');
const { veriToken, checkRole } = require ("../utils/auth");

/* GET property page. 
CRUD = Create, Read, Update & Delete.
Lista de propiedades
crear/editar  la propiedad
borar la propiedad
*/

//Rutas para leer
//todas las maquinas
router.get('/listamaquina', veriToken, (req, res, next)=> {
  Maquina.find()
    .then((maquinas)=>{
        res.status(200).json({result:maquinas})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});

   //Crear una maquina
   router.post('/',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
     console.log(req.body);
       Maquina.create({...req.body})
       .then((maquina)=>{
         res.status(200).json({result:maquina})
       })
       .catch ((error)=>{
           res.status(400).json({msg:"Algo salio mal", error})
       })
   });

  //Editar (Update)
        //post  quiere todas las llaves
        //patch solo quiere una para poder trabajar
router.patch('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
  const {id} = req.params;
  Maquina.findByIdAndUpdate(id, req.body,{new:true})
     .then((maquina)=>{
         res.status(200).json({result:maquina})
     })
     .catch((error)=> {
         res.status(400).json({msg:"Algo salio mal", error})
     })
 });

 router.get('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
  const {id} = req.params;
  Maquina.findById(id)
     .then((maquina)=>{
         res.status(200).json({result:maquina})
     })
     .catch((error)=> {
         res.status(400).json({msg:"Algo salio mal", error})
     })
 });

   module.exports = router;