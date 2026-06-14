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

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "WELA API"
  });
});

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

    const document = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.COLLECTION_ID,
      ID.unique(),
      {
        childName: args.childName || "",

        age: args.age || "Unknown",

        description:
          args.description || "Not provided",

        lastSeenLocation:
          args.lastSeenLocation || "Unknown",

        lastSeenTime:
          args.lastSeenTime || "Unknown",

        callerNumber:
          args.callerNumber || "",

        photoURL: "",

        status: "INTAKE",

        callTranscript: "",

        extractedData: JSON.stringify({
          childName: args.childName,
          age: args.age,
          description: args.description,
          lastSeenLocation:
            args.lastSeenLocation,
          lastSeenTime:
            args.lastSeenTime
        }),

        language:
          args.language || "french",

        callComplete:
          args.callComplete || false,

        emergencyCaseId,

        source: "voice_call"
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

app.post("/handle-photo-upload", async (req, res) => {
module.exports = async function (req, res) {
  try {
    const payload = JSON.parse(req.payload || '{}');

    // Cloudinary webhook payload
    const publicId = payload.public_id || '';
    const secureUrl = payload.secure_url || payload.url || '';

    // Extract caseId from public_id format: wela_[CASE_ID]
    const caseId = publicId.replace('wela_', '');

    if (!caseId || !secureUrl) {
      return res.json({ success: false, error: 'Missing caseId or URL' }, 400);
    }

    const { Client, Databases } = require('node-appwrite');
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      'cases',
      caseId,
      { 
        photoURL: secureUrl,
        status: 'PHOTO_RECEIVED'
      }
    );

    return res.json({ success: true, caseId, photoURL: secureUrl });

  } catch (error) {
    console.error('handlePhotoUpload error:', error);
    return res.json({ success: false, error: error.message }, 500);
  }
};
  
}





