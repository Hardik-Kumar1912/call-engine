// app/api/get-sheet/route.js
import { google } from "googleapis";
import { NextResponse } from "next/server";

function loadCredentialsFromEnv() {
  const b64 = process.env.GOOGLE_CREDS_B64;
  const raw = b64
    ? Buffer.from(b64, "base64").toString("utf8")
    : process.env.GOOGLE_CREDENTIALS;

  if (!raw) {
    throw new Error("Missing Google credentials in env. Set GOOGLE_CREDS_B64 or GOOGLE_CREDENTIALS.");
  }

  const creds = JSON.parse(raw);

  // Fix newline-escaping if private_key contains literal "\n"
  if (creds.private_key && creds.private_key.includes("\\n")) {
    creds.private_key = creds.private_key.replace(/\\n/g, "\n");
  }

  return creds;
}

export async function GET() {
  try {
    const creds = loadCredentialsFromEnv();

    // Use GoogleAuth with in-memory credentials (no local file)
    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
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

    const formatted = rows.map((r) => ({
      name: r[0] || "",
      number: r[1] || "",
    }));

    return NextResponse.json({ rows: formatted });
  } catch (error) {
    // Log full error to server logs, but only send minimal info to client
    console.error("Error /api/get-sheet:", error);
    return NextResponse.json(
      { message: "Error reading sheet", error: String(error) },
      { status: 500 }
    );
  }
}
