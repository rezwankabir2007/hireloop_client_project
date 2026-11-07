import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient("mongodb://localhost:27017/database");
const db = client.db('hrieloopprojectdb');


export const auth = betterAuth({
     
     emailAndPassword: { 
    enabled: true, 
  },
      socialProviders: {
        google: { // [!code highlight]
            clientId: process.env.GOOGLE_CLIENT_ID as string, // [!code highlight]
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // [!code highlight]
        }, // [!code highlight]
    },
  database: mongodbAdapter(db, {
    client,
  }),
});