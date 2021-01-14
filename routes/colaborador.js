const express = require('express');
const router  = express.Router();

const bcrypt = require("bcrypt");
const Colaborador = require ("../models/Colaborador");
const jwt = require("jsonwebtoken");
const { veriToken, checkRole } = require ("../utils/auth");


/* POST Registro */
router.post('/registro', veriToken,checkRole(['Supervisor','Administrador']), (req, res, next) => {
  const {password,confirmapassword, ...userValue} = req.body;
     if(password !== confirmapassword) return res.status(403).json({msg:"Las contraseñas no coinciden"})
   bcrypt.hash(password,10)
   .then((hashedPassword)=>{
       const colaborador = {password:hashedPassword,...userValue};
       Colaborador.create(colaborador).then(()=>{
           res.status(200).json({msg:'Colaborador creado con éxito'});
       }).catch ((error)=>{
        res.status(400).json({msg:'Hubo un error',error});
       })
   })
});

/* POST Ingreso */
router.post('/ingreso', (req, res, next) => {
    const {email,password} = req.body;

    Colaborador.findOne({email})
       .then((colaborador)=>{
           if(colaborador === null)
           return res.status(404).json({msg:'No existe ese correo',error});
           bcrypt.compare(password,colaborador.password)
           .then((coincidio)=>{
               if(coincidio && colaborador.estatus === 'Activo'){
                   const sinpassword = colaborador.toObject();
                   delete sinpassword.password
                   const token = jwt.sign({id:colaborador._id},process.env.SECRET,
                    {expiresIn:"1d"})
                    res.cookie("token",token,{
                        expires: new Date(Date.now +86400000),
                        secure:false,
                        httpOnly:true,
                    }).json({colaborador:sinpassword,code:200})
               } else {
                   return res.status(401).json({msg:'Contraseña incorrecta o Usuario Inactivo',error})
               }
           })
       }).catch ((error)=>{
        res.status(400).json({msg:'Hubo un error',error});
  });
});

router.post("/salir",(req,res,next)=>{
res.clearCookie("token").json({msg:"Vuelve pronto"})
})


  //Editar (Update)
        //post  quiere todas las llaves
        //patch solo quiere una para poder trabajar
        router.patch('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
            const {id} = req.params;
            Colaborador.findByIdAndUpdate(id, req.body,{new:true})
               .then((colaborador)=>{
                   res.status(200).json({result:colaborador})
               })
               .catch((error)=> {
                   res.status(400).json({msg:"Algo salio mal", error})
               })
           });

           router.get('/:id',veriToken,checkRole(['Supervisor','Administrador']), (req,res,next)=>{
            const {id} = req.params;
            Colaborador.findById(id)
               .then((colaborador)=>{
                   res.status(200).json({result:colaborador})
               })
               .catch((error)=> {
                   res.status(400).json({msg:"Algo salio mal", error})
               })
           });
          

module.exports = router;