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
    const MAX_ROW = 1000; // must match get-sheet range
    const startRow = 2; // we write starting at A2

    // Prepare values
    const values = rows.map((r) => [r.name ?? "", r.number ?? ""]);

    // If no rows, clear entire A2:B{MAX_ROW} and return
    if (values.length === 0) {
      const clearRange = `Sheet1!A${startRow}:B${MAX_ROW}`;
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: clearRange,
      });
      return NextResponse.json({ message: "✅ Google Sheet cleared successfully (no rows)." });
    }

    // Compute exact write range for current rows (A2:B{endRow})
    const endRow = startRow - 1 + values.length; // if startRow=2 and values.length=1 => endRow=2
    const writeRange = `Sheet1!A${startRow}:B${endRow}`;

    // Update exact range with provided values
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: writeRange,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    // If there are leftover rows below endRow up to MAX_ROW, clear them
    if (endRow < MAX_ROW) {
      const clearStart = endRow + 1;
      const clearRange = `Sheet1!A${clearStart}:B${MAX_ROW}`;
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: clearRange,
      });
    }

    return NextResponse.json({ message: "✅ Google Sheet Updated Successfully!" });
  } catch (error) {
    console.error("Error /api/update-sheet:", error);
    return NextResponse.json(
      { message: "❌ Error updating sheet", error: String(error) },
      { status: 500 }
    );
  }
}
