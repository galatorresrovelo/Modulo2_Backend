const express = require('express');
const router  = express.Router();

const bcrypt = require("bcrypt");
const colaborador = require ("../models/Colaborador");
const jwt = require("jsonwebtoken");


/* POST Registro */
router.post('/registro', (req, res, next) => {
  const {email,password,confirmapassword,nombre,_maquina,horario_entrada, horario_salida} = req.body;
   if(password !== confirmapassword)
   return res.status(403).json({msg:"Las contraseñas no coinciden"})
   bcrypt.hash(password,10)
   .then((hashedPassword)=>{
       const colaborador = {email, nombre, password:hashedPassword,_maquina, horario_entrada,horario_salida};
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

module.exports = router;