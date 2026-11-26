import dotenv from "dotenv";
import { google } from "googleapis";
import auth from "../config/googleClient.js";

dotenv.config();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Create another sheet/tab named ContactMessages
const RANGE = "Sheet2!A:D";

const addContactRow = async (data) => {
    const client = await auth.getClient();

    const sheets = google.sheets({
        version: "v4",
        auth: client,
    });

    const { name, email, message } = data;

    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[
                name,
                email,
                message,
                new Date().toLocaleString(),
            ]],
        },
    });
};

export { addContactRow };