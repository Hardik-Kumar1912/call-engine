import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "google-credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1TWed-hSlL14Eh5iNHV5NzDbdhcCkleX4_ZC6PGzmYzI";

    // Read data from the sheet
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:B1000",
    });

    const rows = result.data.values || [];

    // convert rows -> [{ name: "", number: "" }]
    const formatted = rows.map(r => ({
      name: r[0] || "",
      number: r[1] || ""
    }));

    return NextResponse.json({ rows: formatted });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error reading sheet", error }, { status: 500 });
  }
}
