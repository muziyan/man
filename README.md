###登录注册接口

`express`来搭建服务和编写接口

搭建服务
```
app.listen("4000", () => {
    console.log("registered and login api!")
});
```
编写接口
```
  app.get("/", async (req, res) => {
      res.send("hello nodeJs!");
  })  
```

使用了`nodemon server.js`来监听文件修改后自动编译

使用`mongoose`来连接`mongodb`数据库
```
mongoose.connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
})
```
创建`mogondb`模型

使用了`bcryptjs`来加密密码

```
const UserSchema = new mongoose.Schema({
    //启用唯一值
    username: {type: String, unique: true},
    password: {type: String,
    //模型中加密密码
    set(val){
        return bcr.hashSync(val,10);
    }
    },
})

const User = mongoose.model("User", UserSchema)
```

验证密码使用的方法
```
    const isPasswordValid = require("bcryptjs").compareSync(
        req.body.password,
        user.password
    );
```

使用了`jsonwebtoken`来生成token头保存登录的用户id

这个SECRET是在登录用户那获取的秘钥,用这个验证能不能获取后续数据

`const SECRET = "kladksjlflksadfjl";`

加密用户id

```
    //生成token
    const token = jwt.sign({
        //加密token
        id : String(user._id),
    },SECRET)
```


写个中间件来简化后续需要用户id的操作
```
//中间件
const auth = async (req,res,next)=>{
    const raw = String(req.headers.authorization).split(" ").pop();
    const {id} = jwt.verify(raw,SECRET);
    req.user = await User.findById(id);

    //执行下一步操作
    next();
}
```

中间件使用方法
```
app.get("/profile",auth,async (req,res)=>{

    res.send(req.user);
})
```

要测试登录后获取数据要获取到登陆后返回的token值