// app/api/update-sheet/route.js
import { google } from "googleapis";
import { NextResponse } from "next/server";

function loadCredentialsFromEnv() {
  // Prefer base64-encoded env var (safe for dashboard paste)
  const b64 = process.env.GOOGLE_CREDS_B64;
  const raw = b64
    ? Buffer.from(b64, "base64").toString("utf8")
    : process.env.GOOGLE_CREDENTIALS;

  if (!raw) {
    throw new Error("Missing Google credentials. Set GOOGLE_CREDS_B64 or GOOGLE_CREDENTIALS.");
  }

  const creds = JSON.parse(raw);

  // Fix newline-escaping if private_key contains literal "\n"
  if (creds.private_key && creds.private_key.includes("\\n")) {
    creds.private_key = creds.private_key.replace(/\\n/g, "\n");
  }

  return creds;
}

export async function POST(req) {
  try {
    const { rows } = await req.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json({ message: "Invalid payload: rows must be an array" }, { status: 400 });
    }

    const creds = loadCredentialsFromEnv();

    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1TWed-hSlL14Eh5iNHV5NzDbdhcCkleX4_ZC6PGzmYzI"; // your sheet ID

    const values = rows.map((r) => [r.name ?? "", r.number ?? ""]);

    // If you want to overwrite a fixed block:
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A2:B1000",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    // If you'd prefer to replace only the rows length, you could compute range dynamically:
    // const endRow = 1 + values.length; // since A2 is row 2
    // await sheets.spreadsheets.values.update({
    //   spreadsheetId,
    //   range: `Sheet1!A2:B${endRow}`,
    //   valueInputOption: "RAW",
    //   requestBody: { values },
    // });

    return NextResponse.json({ message: "✅ Google Sheet Updated Successfully!" });
  } catch (error) {
    console.error("Error /api/update-sheet:", error);
    return NextResponse.json(
      { message: "❌ Error updating sheet", error: String(error) },
      { status: 500 }
    );
  }
}
