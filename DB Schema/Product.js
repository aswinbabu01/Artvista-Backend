//Create a schema
const {
    Schema,
    model
  } = require("mongoose");

const MySchema = new Schema({
    userid:{
      type: String,
      required: true,
    },   
    Email:{
      type:String,
      required:true
    },
    ProductDetails:[
        {
            head:String,
            id:Number,
            image:String,
            Type:String,
            price:String,
            quantity:Number
        }]
});
  const TaskModel = model("Product", MySchema)

module.exports = TaskModel