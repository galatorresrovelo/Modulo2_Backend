const express = require('express');
const router = express.Router();
// importar lo importante
const Cliente = require ('../models/Cliente');
const { veriToken, checkRole } = require ("../utils/auth");
/* GET cliente page. 
CRUD = Create*, Read*, Update* & Delete.
*/

router.post('/',veriToken,checkRole(['Supervisor','Administrador']), (req, res, next)=> { 
    //voy a sacar el de la persona loggeada
    //crear un cliente
    const { _id: _colaborador } = req.colaborador
    
    //({title,address,description...})
    Cliente.create({...req.body, _colaborador})
    .then((cliente)=>{
        res.status(201).json({result:cliente})
    }).catch((error)=>{
        res.status(400).json({msg:"Algo salio mal", error})
    });
} );

//Editar (Update)
//post  quiere todas las llaves
//patch solo quiere una para poder trabajar
router.patch('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
 const {id} = req.params;

 Cliente.findByIdAndUpdate(id, req.body,{new:true})
    .then((cliente)=>{
        res.status(200).json({result:cliente})
    })
    .catch((error)=> {
        res.status(400).json({msg:"Algo salio mal", error})
    })
});

router.get('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
    const {id} = req.params;
   
    Cliente.findById(id)
       .then((cliente)=>{
           res.status(200).json({result:cliente})
       })
       .catch((error)=> {
           res.status(400).json({msg:"Algo salio mal", error})
       })
   });
module.exports = router;
