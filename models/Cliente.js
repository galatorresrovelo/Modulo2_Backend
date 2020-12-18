const {Schema, model} = require ("mongoose");

const clienteSchema = new Schema( 
        { 
            nombre:{
                type: String,
                required:[true,"Debes agregar un nombre"]
               },
        
                año_de_ingreso:{
                   type:Number,
                   required:[true,"Debes agregar el año en que empezaron a ser nuestros clientes"]
                },
        
               _pedido:{
                type:Schema.Types.ObjectId,
                ref:"Pedido"
               }
            },
        {timestamps:true}
        
        );
        
        module.exports = mongoose.model("Cliente",clienteSchema)