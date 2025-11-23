const mongoose= require("mongoose");
const productSchema=new mongoose.Schema({   
    name:String,
    brand:String,
    price:Number, 
    description:String, 
    category:String, 
    subcategory:String,
    images:[String],
    defaultImage:String,

    status:{ type: String, default:'normal'},
})

module.exports = mongoose.model("product", productSchema);