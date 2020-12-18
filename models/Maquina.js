const {Schema, model} = require ("mongoose");

const maquinaSchema = new Schema( 
    {
        _colaborador:{
            type:Schema.Types.ObjectId,
            ref:"Colaborador",
            required:[true,"Debe tener uno o varios colaboradores asignados"]
        },
       
        modelo:{
            type:String,
            required:[true,"Debes agregar el modelo de la máquina"],
        },

        capacidad:{
            type:Number,
            required: [true,"Debe tener una capacidad de producción por hora"],
        },

        estado:{
            type:String,
            default:"Activa",
            enum:["Activa","No disponible","Apagada"],
        },

    },
    {timestamps:true}
);

module.exports = model("Maquina", maquinaSchema)