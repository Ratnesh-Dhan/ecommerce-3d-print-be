import dotenv from "dotenv";
import { google } from "googleapis";
import auth from "../config/googleClient.js";

dotenv.config();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = "Sheet1!A:L";

const addRow = async (data) => {
  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const {
    quoteId,
    date,
    time,
    name,
    phone,
    email,
    message,
    material,
    color,
    quantity,
    weight,
    infill,
    shipping,
    fileName,
    fileKey,
  } = data;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          quoteId,
          date,
          time,
          name,
          phone,
          email,
          message,
          material,
          color,
          quantity,
          weight,
          infill,
          shipping,
          fileName,
          fileKey,
        ],
      ],
    },
  });
};

export { addRow };
