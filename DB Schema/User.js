//Create a schema
const {
    Schema,
    model
  } = require("mongoose");

const MySchema = new Schema({
    Userid:{
      type: Number,
      required: true,
    },
    UserName: {
      type: String,
      required: true,
      maxlength: 100
    },
    Email: {
      type: String,
      required: true,
      maxlength: 100,
      unique:true      
    },  
    Password: {
      type: String,
      required: true,
    },
    UserType: {
      type: String,
      required: false,
      maxlength: 50
    },  
});
  const TaskModel = model("User", MySchema)

module.exports = TaskModel