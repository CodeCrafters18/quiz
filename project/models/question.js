const mongoose = require('mongoose');

const qschema= new mongoose.Schema({
    id:{
        type:Number,
    },
    question:{
        type: String
    },
    A:{
        type:String
    },
    B:{
        type:String
    },
    C:{
        type:String
    },
    D:{
        type:String
    },
    answer:{
        type:String
    },
    selected:{
        type:String
    }
})

const question=new mongoose.model("question",qschema);

module.exports=question;