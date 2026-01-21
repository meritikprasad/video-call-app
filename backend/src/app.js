import express from "express";
import { createServer } from "node:http";

import { connectToSocket } from "./controllers/socketManager.js";

import mongoose from "mongoose";

import cors from "cors";

// const userRouter = require("./routes/users.routes.js");
import userRoutes from "./routes/users.routes.js";


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));


app.use("/api/v1/users", userRoutes);
// app.use("/api/v2/users", newUserRoutes); // for same but new user route version

const start = async () => {

    const connectionDb = await mongoose.connect("mongodb+srv://ritikprasad1510_db_user:LtrLlulW3Aw2NDDB@cluster0.sfz2wyz.mongodb.net/")

    console.log(`MONGO Connected db Host: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("LISTENING ON PORT 8000");
    });

}

start();









// // I added for [export, import module] // not for require in package.json
// // comments are not permitted in json so wrote here

// import express from "express";
// import { createServer } from "node:http";

// // export const me {} me import karna hai
// import { connectToSocket } from "./controllers/socketManager.js";   // .js nahi to error diya

// import mongoose from "mongoose";

// import cors from "cors";

// // app and socket connection
// const app = express();
// const server = createServer(app);
// const io = connectToSocket(server);

// // setting variable for app port = given value lly other variables too and app.get("variable") karke use karo
// app.set("port", (process.env.PORT || 8000));

// app.use(cors());
// app.use(express.json({limit: "40kb"}));
// app.use(express.urlencoded({limit: "40kb", extended: true})); 

// const start = async () => {

//     const connectionDb = await mongoose.connect("mongodb+srv://ritikprasad1510_db_user:LtrLlulW3Aw2NDDB@cluster0.sfz2wyz.mongodb.net/")

//     console.log(`MONGO Connected db Host: ${connectionDb.connection.host}`);

//     server.listen(app.get("port"), () => {
//         console.log("LISTENING ON PORT 8000");
//     });

//     // app.listen(8000, () => {
//     //     console.log("LISTENING ON PORT 8000");
//     // });

// }

// start();


// just for understanding

// app.get("/home", (req, res) => {
//     return res.json({ "hello": "World" });
// });
