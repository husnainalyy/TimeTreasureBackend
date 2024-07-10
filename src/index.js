import connectDB  from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})


connectDB()
    .then(() => {
        app.listen(process.env.Port|| 8000,() => {
            console.log(`Server is running at Port :${process.env.Port}`)
        })
    })
    .catch((error) => {
        console.log("MONGODB connection failed ",error);
    })