const jwt = require("jsonwebtoken");
const Colaborador = require("../models/Colaborador");

exports.veriToken =(req,res,next)=> {
    const {token} = req.cookies;
    // usamos verify para ver si existe un token
    jwt.verify(token, process.env.SECRET, (error,decoded)=>{

        if(error) return res.status(401).json({error});

        // decoded = {id} osea un objeto con la llave id (segun lo que ustedes guardaron)
        //va a buscar con el objeto decoded en a llave id
        Colaborador.findById(decoded.id)

        .then((colaborador)=>{
         req.colaborador = colaborador; 
         next()
        });
    });

};

//haremos un Middleware para checar roles y un utils para limpiar respuesta de datos basura
//["Administrador", "Supervisor", "Estandard"]
exports.checkRole = (rols) => {
    //(next, req) => Orden es importante porque las propiedades tiene su funcion por orden
    return (req, res, next) => {
        //{name:"Gala",rol:"Estandard"}
       const {rol} = req.colaborador;
       if(rols.includes(rol)){
            return next()
       } else {
           return res.status(403).json({msg:"No tienes permiso para realizar esa acción"})
       }
    }
}

//Limpiar el objeto

exports.clearRes = (data) => {
    //destructuramos el objeto data y retornamos un nuevo objeto unicamente con los datos requeridos.
    const {password, __v,createdAt, updatedAt,...cleanedData} = data;
    //{key:"value"}
    return cleanedData
}

