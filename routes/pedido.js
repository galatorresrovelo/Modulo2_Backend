const express = require('express');
const router  = express.Router();

// importar lo importante
const Pedido = require ('../models/Pedido');
const { veriToken, checkRole } = require ("../utils/auth");

/* GET property page. 
CRUD = Create, Read, Update & Delete.
Lista de propiedades
crear/editar  la propiedad
borar la propiedad
*/

//Rutas para leer
//todas los pedidos por colaborador
router.get('/colaborador/:colaborador_id', veriToken, (req, res, next)=> {
 const {_id} = req.colaborador;
  Pedido.find({ _colaborador: _id })
  .populate({ // <---- agegar todo este para hacer un populate aninado
    path:"pedido",
    populate:{
        path:"_cliente",
        select: "nombre",
    },
})
    .then((pedidos)=>{
        res.status(200).json({result:pedidos})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error})
    })
});

//Traer todos los pedidos por cliente
router.get('/cliente/:cliente_id', veriToken, (req, res, next)=> {
    const {cliente_id} = req.params;
     Pedido.find({_cliente: cliente_id})
     .populate("_colaborador","nombre") //<----- Populate
     .then((pedidos)=>{
         res.status(200).json({result:pedidos})
     })
       .catch((error)=>{
           res.status(400).json({msg:"Algo salió mal", error})
       })
   });

   //Crear una pedido
   router.post('/',veriToken,checkRole(['Supervisor','Administrador']),(req,res,next)=>{

       const{_id: _colaborador} = req.colaborador;
       const pedido = {...req.body,_colaborador};

       Pedido.create(pedido)
       .then((pedido)=>{
         res.status(200).json({result:pedido})
       })
       .catch ((error)=>{
           res.status(400)({msg:"Algo salio mal", error})
       })
   });

  //Editar (Update)
        //post  quiere todas las llaves
        //patch solo quiere una para poder trabajar
router.patch('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
  const {id} = req.params;
  Pedido.findByIdAndUpdate(id, req.body,{new:true})
     .then((pedido)=>{
         res.status(200).json({result:pedido})
     })
     .catch((error)=> {
         res.status(400).json({msg:"Algo salio mal", error})
     })
 });


 //Editar (Update)
        //post  quiere todas las llaves
        //patch solo quiere una para poder trabajar
router.patch('/estatus/:id',veriToken, (req,res,next)=>{
    const {id} = req.params;
    const {estatus} = req.body;
    Pedido.findByIdAndUpdate(id, {estatus},{new:true})
       .then((pedido)=>{
           res.status(200).json({result:pedido})
       })
       .catch((error)=> {
           res.status(400).json({msg:"Algo salio mal", error})
       })
   });

   router.get('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
    const {id} = req.params;
    Pedido.findById(id)
       .then((pedido)=>{
           res.status(200).json({result:pedido})
       })
       .catch((error)=> {
           res.status(400).json({msg:"Algo salio mal", error})
       })
   });

   module.exports = router;
