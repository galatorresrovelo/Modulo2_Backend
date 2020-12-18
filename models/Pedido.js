const {Schema, model} = require ("mongoose");

const pedidoSchema = new Schema( 
    {
        _colaborador:{
            // esto es para decirle que insertara un id de un elemento de la base de datos
            type:Schema.Types.ObjectId,
            ref:"Colaborador",
            required:[true,"Es requerido que un colaborador sea asignado al pedido"]
        },

        _cliente:{
            // esto es para decirle que insertara un id de un elemento de la base de datos
            type:Schema.Types.ObjectId,
            ref:"Cliente",
            required:[true,"Es requerido que haya un cliente asignado al pedido"]
        },

        cantidad:{
            type:Number,
            required: [true,"Se ingresar la cantidad de producto a fabricar"],
        },

        fecha_de_inicio:{
            type:Date,
        },

        fecha_de_termino:{
            type:Date,
        },
        estatus:{
            type:String,
            default:"En espera",
            enum:["En espera","En proceso","Cancelada", "Terminada"], 
        }
    },
    {timestamps:true}
);

module.exports = model("Pedido", pedidoSchema)