const mongoose = require("mongoose");
const bcr = require("bcryptjs");


mongoose.connect("mongodb://localhost:27017/auth", {
    //使用唯一值
    useCreateIndex: true,
    useNewUrlParser: true,
})

const UserSchema = new mongoose.Schema({
    //启用唯一值
    username: {type: String, unique: true},
    password: {type: String,
    set(val){
        return bcr.hashSync(val,10);
    }
    },
})


const User = mongoose.model("User", UserSchema)

//清空表数据
// User.db.dropCollection("users");

module.exports = {
    User
}