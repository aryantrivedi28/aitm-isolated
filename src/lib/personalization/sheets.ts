import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";


function extractSheetId(urlOrId: string) {
const m = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
return m ? m[1] : urlOrId; // allow passing raw ID too
}


export async function openSheet(urlOrId: string) {
const sheetId = extractSheetId(urlOrId);


const auth = new JWT({
email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
scopes: [
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/drive.readonly",
],
});


const doc = new GoogleSpreadsheet(sheetId, auth as any);
await doc.loadInfo();
return doc;
}


export async function getFirstSheet(doc: any) {
const sheet = doc.sheetsByIndex[0];
if (!sheet) throw new Error("No sheets found in document");
return sheet;
}


export async function ensureColumns(sheet: any, columns: string[]) {
await sheet.loadHeaderRow();
const headers: string[] = sheet.headerValues || [];
const missing = columns.filter((c) => !headers.includes(c));
if (missing.length) {
const newHeaders = [...headers, ...missing];
await sheet.setHeaderRow(newHeaders);
}
}