//creating a local Server
// 1st step
let express=require('express');
let mongoose=require('mongoose');
const cors = require('cors');
const nodemon= require('nodemon');
let app=express();
const multer = require('multer');
const path = require('path');


let bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
require('dotenv').config();

//to get static images from server using URL path
app.use("/images",express.static(path.join(__dirname,"public/images")));
 
//2nd Step- Interlinking the routes.js file and app.js file
require('./routes')(app);
app.use(cors());
app.options('*', cors());


// app.use(cors({
//   origin: "https://inquisitive-biscochitos-4ec763.netlify.app/", // Replace with your frontend origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// }));

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, path.join(__dirname,"public/images"));
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})
const upload = multer({storage});
app.post("/upload",upload.single("file"),(req,res)=>{
  try{
    // console.log(req.file.path,"image path before multer upload");
    res.status(200).json("Image uploaded successfully!");
  }catch(err){
    res.status(500).json("image not uploaded!");
    console.log(err);
  }
})
//3rd Step- Creating a server
let server=app.listen(3457,function(){// is a Port number
    console.log("Server listening at Port",server.address().port)
    connectDB();
}); 
//To Connect MongoDB
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URL, {
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
