import dotenv from "dotenv";
dotenv.config(); //This line loads environment variables from a .env file into the Node.js process environment.

import express from "express";
import { createServer } from "node:http";
import connectToSocket from "./controllers/socketmanager.js";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userroutes.js";

const url = process.env.MONGO_URL; // make sure .env has MONGO_URL
const PORT = process.env.PORT || 8000;

const app = express();//created app instance .....express() → brain (logic, routes)
const server = createServer(app);//createServer() → body (actually receives requests)
//Client → HTTP Server → Express app → Response
//const io = new Server(server);//new Server(server) → adds live communication ability (like phone calls instead of emails)
const io = connectToSocket(server);
//Socket.IO now 1️⃣hooks into the HTTP server.It starts listening to the same server:
//2️⃣ Intercepts special requests 👉 Socket.IO says:“This request is mine, not Express”....3️⃣ Handles protocol upgrade....4️⃣ Maintains persistent connections

app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.use("/api/v1/users",userRoutes);//“For any request starting with /api/v1/users, use userRoutes to handle it.”

app.get("/home", (req, res) => {
  return res.json({ "hello": "World" });
});

// Debug (optional but useful)
console.log("Mongo URL:", url);

if (!url) {
  console.error("MONGO_URL is not defined in .env");
  process.exit(1);
}

mongoose.connect(url)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

server.listen(PORT, () => {
  console.log("App started on port", PORT);
});