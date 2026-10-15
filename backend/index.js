import express from "express";
import db from "./config/database.js";
import tb_barang from "./models/masterBarang.js";
import ActivityLog from "./models/logActivity.js";
import dotenv from "dotenv"
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("database connected")
    // await db.sync({ alter: true });
    // await ActivityLog.sync()
} catch(error) {
    console.log(error)
}

app.use(cors({credentials:true, origin: 'http://localhost:5173'}))
app.use(cookieParser())
app.use(express.json())
app.use("/images", express.static("public/images"))
app.use(router)
app.listen(5000, ()=> console.log('server running at port 5000'))