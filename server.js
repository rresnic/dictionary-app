const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter.js");
const {db} = require("./config/db.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter); 

app.listen(3000, () => console.log("Server running on port 3000"));


async function test(){
    try {
        const response = await db.raw('select version()');
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
}
test();