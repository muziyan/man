const {User} = require("./models");

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");


//下面一大串字母应该是电脑的秘钥,进行校验的时候需要用到
const SECRET = "kladksjlflksadfjl";

app.use(express.json());


app.get("/", async (req, res) => {
    const users = await User.find();
    res.send(users);
})


app.post("/register", async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })

    res.send(user);
})


app.post("/login",async (req,res)=>{
    const user = await User.findOne({
        username : req.body.username
    })

    if (!user){
        return res.status(422).send({
            message:"用户名不存在!"
        })
    }

    const isPasswordValid = require("bcryptjs").compareSync(
        req.body.password,
        user.password
    );

    if (!isPasswordValid){
        return res.status.status(422).send({
            message:"密码无效!"
        })
    }

    //生成token
    const token = jwt.sign({
        //加密token
        id : String(user._id),
    },SECRET)


    res.send({
        user,
        token
    });
})

//中间件
const auth = async (req,res,next)=>{
    const raw = String(req.headers.authorization).split(" ").pop();
    const {id} = jwt.verify(raw,SECRET);
    req.user = await User.findById(id);

    //执行下一步操作
    next();
}

app.get("/profile",auth,async (req,res)=>{

    res.send(req.user);
})



app.listen("4000", () => {
    console.log("registered and login api!")
});

