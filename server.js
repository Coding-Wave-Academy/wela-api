import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { getDatabase } from "./appwrite.js";
import { ID } from "node-appwrite";

const databases = getDatabase();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});