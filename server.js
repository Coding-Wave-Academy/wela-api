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

app.post("/create-case", async (req, res) => {

  try {

    const args =
      req.body.message.toolCalls[0]
      .function.arguments;

    const emergencyCaseId =
      "WELA-" + Date.now();

    const document =
      await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.COLLECTION_ID,
        ID.unique(),
        {
          childName: args.childName,
          age: args.age || "",
          description: args.description || "",
          lastSeenLocation:
            args.lastSeenLocation || "",
          lastSeenTime:
            args.lastSeenTime || "",
          callerNumber:
            args.callerNumber || "",
          language:
            args.language || "english",

          status: "active",
          source: "voice_call",

          emergencyCaseId,

          createdAt:
            new Date().toISOString()
        }
      );

    return res.json({
      success: true,
      caseId: emergencyCaseId,
      documentId: document.$id
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }

});
