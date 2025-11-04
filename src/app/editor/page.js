// app/editor/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditorPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSheet() {
      setLoading(true);
      try {
        const res = await fetch("/api/get-sheet");
        const data = await res.json();
        setRows(data.rows || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load sheet.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    loadSheet();
  }, []);

  function addRow() {
    setRows((p) => [...p, { name: "", number: "" }]);
  }
  function deleteRow(i) {
    setRows((p) => p.filter((_, idx) => idx !== i));
  }
  function updateRow(i, field, value) {
    setRows((p) => {
      const copy = p.map((r) => ({ ...r }));
      copy[i] = copy[i] || {};
      copy[i][field] = value;
      return copy;
    });
  }
  function clearSheet() {
    setRows([{ name: "", number: "" }]);
  }

  async function saveToGoogleSheet() {
    setSaving(true);
    setMessage("Saving...");
    try {
      const res = await fetch("/api/update-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || "Save failed");

      setMessage("Saved successfully");

      // refresh from sheet
      const r2 = await fetch("/api/get-sheet");
      const d2 = await r2.json();
      setRows(d2.rows || []);
    } catch (err) {
      console.error(err);
      setMessage("Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  }

  async function handleRun() {
    if (!confirm("Start the calling workflow?")) return;
    setRunning(true);
    setMessage("Starting...");
    try {
      const res = await fetch("/api/make/run", { method: "POST" });
      const j = await res.json();
      if (!res.ok) {
        setMessage("Run failed");
        console.error(j);
      } else {
        setMessage("Run started");
      }
    } catch (err) {
      console.error(err);
      setMessage("Run error");
    } finally {
      setRunning(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-sky-50 via-white to-sky-100">

      {/* HEADER */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SVG logo (same as homepage) */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-600 to-teal-400 flex items-center justify-center shadow text-white text-2xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="block"
              >
                <path
                  d="M3 10.5C3 16.299 8.043 21 14 21v-2.5"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                />
                <path
                  d="M21 8.5c0-5.5-6.477-6-7.5-6C11.478 2.5 6 3 6 8.5S11.478 15 13.5 15c1.023 0 7.5-.5 7.5-6.5z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                />
              </svg>
            </div>

            <div>
              <h3 className="font-bold text-lg sm:text-xl text-slate-800">Call Engine</h3>
              <p className="text-xs sm:text-sm text-slate-500">Google Sheet Editor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:inline text-sm text-slate-600 hover:text-slate-800 hover:underline">
              Home
            </Link>
            <button
              onClick={addRow}
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm"
            >
              + Add Row
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Sheet Editor</h2>
              <p className="text-sm text-slate-500">Manage contacts and trigger workflows</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearSheet}
                className="px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-sm"
              >
                Clear
              </button>
              <button
                onClick={saveToGoogleSheet}
                className={`px-4 py-2 rounded-md text-sm text-white shadow ${
                  saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleRun}
                className={`px-4 py-2 rounded-md text-sm text-white shadow ${
                  running ? "bg-amber-300" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {running ? "Running..." : "Run"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* DESKTOP/TABLE (md+) */}
              <div className="hidden md:block overflow-auto rounded-xl border border-slate-200">
                <table className="min-w-full table-auto">
                  <thead className="bg-sky-50/60 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Number</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700 w-40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 border-t">
                        <td className="px-4 py-3">
                          <input
                            value={row.name || ""}
                            onChange={(e) => updateRow(i, "name", e.target.value)}
                            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-400"
                            placeholder="Contact name"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={row.number || ""}
                            onChange={(e) => updateRow(i, "number", e.target.value)}
                            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-400"
                            placeholder="+91 91234 56789"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => deleteRow(i)}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                              aria-label={`Delete row ${i + 1}`}
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                const newRow = { ...row };
                                setRows((prev) => {
                                  const copy = prev.map((r) => ({ ...r }));
                                  copy.splice(i + 1, 0, newRow);
                                  return copy;
                                });
                              }}
                              className="px-3 py-1 bg-sky-50 text-sky-700 rounded hover:bg-sky-100"
                              aria-label={`Duplicate row ${i + 1}`}
                            >
                              Duplicate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-10 text-slate-500 text-sm">
                          No rows. Click "Add Row".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS (sm / md-) */}
              <div className="md:hidden space-y-3">
                {rows.map((row, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-slate-500">Name</label>
                        <input
                          value={row.name || ""}
                          onChange={(e) => updateRow(i, "name", e.target.value)}
                          className="w-full rounded-md border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-300"
                          placeholder="Contact name"
                        />
                        <label className="text-xs text-slate-500 mt-3 block">Number</label>
                        <input
                          value={row.number || ""}
                          onChange={(e) => updateRow(i, "number", e.target.value)}
                          className="w-full rounded-md border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-300"
                          placeholder="+91 91234 56789"
                        />
                      </div>

                      <div className="flex flex-col gap-2 ml-3">
                        <button
                          onClick={() => deleteRow(i)}
                          className="px-3 py-2 rounded-md bg-red-50 text-red-700 text-sm hover:bg-red-100"
                          aria-label={`Delete row ${i + 1}`}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            const newRow = { ...row };
                            setRows((prev) => {
                              const copy = prev.map((r) => ({ ...r }));
                              copy.splice(i + 1, 0, newRow);
                              return copy;
                            });
                          }}
                          className="px-3 py-2 rounded-md bg-sky-50 text-sky-700 text-sm hover:bg-sky-100"
                          aria-label={`Duplicate row ${i + 1}`}
                        >
                          Duplicate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {rows.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">No rows. Click "Add Row".</div>
                )}
              </div>

              {/* INFO + STATUS */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">{rows.length} rows</div>
                <div className="text-sm text-blue-700 font-medium">{message}</div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM TOOLBAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <button
            onClick={addRow}
            className="flex-1 mr-1 px-3 py-2 rounded-md bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100"
            aria-label="Add Row"
          >
            + Row
          </button>
          <button
            onClick={saveToGoogleSheet}
            className="flex-1 mx-1 px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            aria-label="Save"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleRun}
            className="flex-1 ml-1 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
            aria-label="Run"
          >
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Call Engine</span>
          <span>Google Sheets • Make.com • Twilio</span>
        </div>
      </footer>
    </div>
  );
}
