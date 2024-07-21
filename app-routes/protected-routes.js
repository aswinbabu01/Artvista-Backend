const verifyToken = require("../middleware/auth-middleware");
const Product = require("../DB Schema/Product");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const fs = require("fs");

module.exports = async function (app) {
  //Add to Cart
  app
    .post("/AddToCart", verifyToken, async (req, res) => {
      const taskData = req.body;
      Product.create(taskData)
        .then(() => {
          res.status(201).json({
            success: true,
          });
        })
        .catch((error) => {
          res.status(404).json({
            success: false,
            error: error.message,
          });
        });
    });
    

  //Retrieve the Cart Data
  app.get("/GetCartData", verifyToken, async (req, res) => {
    const taskData = req.body;
    await Product.findOne({ userid: taskData.userid }).then((user) => {
      if (user !== null) {
        res.send(user.ProductDetails);
      } else {
        res.send("User doesn't Exist");
      }
    });
  });

  //Delete the Item in cart
  app.delete("/DeleteCart", verifyToken, async (req, res) => {
    const taskData = req.body;
    const ProductData = await Product.findOne({ userid: taskData.userid });
    if (ProductData !== null) {
      ProductData.ProductDetails.forEach(async (item) => {
        if (item.id === parseInt(taskData.id)) {
          await Product.updateOne(
            { userid: taskData.userid },
            { $pull: { ProductDetails: { _id: item._id } } }
          );
          res.send("Deleted Successfully");
        }
      });
    }
  });

  app.get("/create-intent", verifyToken, async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
    });
    return res.send({ client_secret: paymentIntent.client_secret });
  });

  //write data.js file
  app.post("/writejsfile", async (req, res) => {
    const taskData = req.body;
    const path = "data.json";
    const data = JSON.parse(fs.readFileSync(path, "utf-8"));
    data.product.push(taskData);
    fs.writeFileSync(path, JSON.stringify(data), "utf-8");
    res.status(200).send("success");
  });

  //read the file and pass it to frontend
  app.get("/readjsfile", async (req, res) => {
    const path = "data.json";
    const data = fs.readFileSync(path, "utf-8");
    res.send(data);
  });
};
