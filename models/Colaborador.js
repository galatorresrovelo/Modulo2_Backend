const {Schema, model,models} = require ("mongoose");

const colaboradorSchema = new Schema(
{ 
    nombre:{
        type: String,
        required:[true,"Debes agregar un nombre"]
       },

        horario_entrada:{
           type:String,
           default: '9:00'
        },

       horario_salida:{
        type:String,
        default: '18:00'
       },

       estatus:{
        type:String,
        default:"Activo",
        enum:["Activo","Inactivo"],
       },

       _maquina:{
        type:Schema.Types.ObjectId,
        ref:"Maquina",
        // required:[true,"Tiene que tener una máquina asignada"]
       },

        email:{
        type:String,
        required:[true,"Debes agregar un email"],
        validate:{
            message:"El email ya tiene una cuenta asociada",
            validator: async ( email ) => {
                const items = await models["Colaborador"].count({email})
                return items < 1
            },
        },
    },

        rol:{
            type:String,
            default:"Estandar",
            enum:["Administrador","Supervisor","Estandar"],
        },
    
        password:{
            type:String,
            required:[true,"Debes agregar un password"],
        },
    },
{timestamps:true}

);

module.exports = model("Colaborador",colaboradorSchema)