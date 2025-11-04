import { NextResponse } from "next/server";

export async function POST() {
  try {
    const MAKE_BASE = process.env.MAKE_BASE || "https://eu2.make.com/api/v2";

    // Make token (your env should contain only raw token)
    let MAKE_TOKEN = process.env.MAKE_TOKEN || "";
    if (!MAKE_TOKEN.startsWith("Token ")) {
      MAKE_TOKEN = "Token " + MAKE_TOKEN;
    }

    const SCENARIO_ID = process.env.SCENARIO_ID;

    if (!MAKE_TOKEN || !SCENARIO_ID) {
      return NextResponse.json(
        { error: "Missing MAKE_TOKEN or SCENARIO_ID" },
        { status: 500 }
      );
    }

    // ✅ Run scenario only
    const runRes = await fetch(`${MAKE_BASE}/scenarios/${SCENARIO_ID}/run`, {
      method: "POST",
      headers: {
        Authorization: MAKE_TOKEN,
        Accept: "*/*",
      },
    });

    const runText = await runRes.text();

    if (!runRes.ok) {
      return NextResponse.json(
        { error: "Run failed", status: runRes.status, details: runText },
        { status: runRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      runResponse: runText,
    });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
