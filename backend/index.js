import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}`);
});
