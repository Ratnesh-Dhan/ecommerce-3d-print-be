import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

// const auth = new google.auth.GoogleAuth({
//   keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export default auth;
