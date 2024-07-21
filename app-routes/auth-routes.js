const bcrypt=require('bcrypt');
const User = require('../DB Schema/User');
const jwt = require('jsonwebtoken');

module.exports = async function (app) {
    //Signup API
    app.post('/signup', async function (req, res) {
        try {
            const taskData = await req.body;
            const salt=await bcrypt.genSalt(10);
            const hashedpwd=await bcrypt.hash(taskData.Password,salt);
            taskData.Password=hashedpwd;
            await User.find().then((allusers) => {
                if (allusers.length >= 1) {
                    let usercount = parseInt(allusers.length);
                    taskData.Userid = usercount + 1;
                    allusers.forEach(item => {
                        if (item.Email === req.body.Email) {
                            res.send("User already Exists")
                        } else {
                            User.create(taskData)
                                .then(() => {
                                    res.status(201)
                                        .json({
                                            success: true,
                                        })
                                }).catch((error) => {
                                    res.status(404)
                                        .json({
                                            success: false,
                                            error: error.message
                                        })
                                })
                        }
                    });
                } else {
                    taskData.Userid = 1;
                    User.create(taskData)
                        .then(() => {
                            res.send("success")
                        }).catch((error) => {
                            res.status(404)
                                .json({
                                    success: false,
                                    error: error.message
                                })
                        })
                }
            }).catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        error: error.message
                    })
            });
        } catch (error) {
            res.status(500)
                .json({
                    success: false,
                    message: "Internal server error"
                })
        }
    });

    //Login API
    app.post('/login', async function (req, res) {
        try {
            const data = await req.body;
            await User.findOne({ Email: data.Email}).then(async(userdata) => {
                if (userdata !== null) {
                    let isValidUser = await bcrypt.compare(data.Password,userdata.Password);                    
                    if (!isValidUser) {
                        return res.sendStatus(401).json({
                            message: "Unauthorized",
                        })
                    }
                    const token = jwt.sign({ userId: userdata._id }, process.env.JWT_SECRET_KEY, {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                        });
                    return res.send({
                        token,
                        userid:userdata.id,
                        username: userdata.UserName,
                        usertype: userdata.UserType,
                    });
                }else{
                    res.send("Incorrect Email or Password");
                }
            }).catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        error: error.message
                    });
            });
        } catch (Exception) {
            res.status(500)
                .json({
                    success: false,
                    message: "Internal server error"
                });
        }
    });
}