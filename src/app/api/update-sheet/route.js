import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { rows } = await req.json();

    const auth = new google.auth.GoogleAuth({
      keyFile: "google-credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1TWed-hSlL14Eh5iNHV5NzDbdhcCkleX4_ZC6PGzmYzI"; // your sheet ID

    const values = rows.map((r) => [r.name, r.number]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A2:B1000",
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ message: "✅ Google Sheet Updated Successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "❌ Error updating sheet", error }, { status: 500 });
  }
}
