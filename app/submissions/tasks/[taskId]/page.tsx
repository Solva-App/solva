"use client";

import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { useParams, useRouter } from "next/navigation";

type Submission = {
  id?: string;
  _id?: string;
  link?: string;
  url?: string;
  createdAt?: string;
  submittedAt?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://solva-backend-prod.onrender.com/api/v1";

const API = {
  listByTask: (taskId: string) => `${API_BASE}/submissions/task/${taskId}`,
  approve: (id: string) => `${API_BASE}/submissions/approve/${id}`,
  reject: (id: string) => `${API_BASE}/submissions/reject/${id}`,
};

// If your backend expects POST instead of PATCH, change this to "POST"
const MUTATION_METHOD: "PATCH" | "POST" = "PATCH";

function getId(s: Submission) {
  return (s.id ?? s._id ?? "") as string;
}

function getLink(s: Submission) {
  return s.link ?? s.url ?? "";
}

function formatDate(raw?: string) {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Tries to read token from common keys. Adjust to match your app.
 */
function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    null
  );
}

async function safeReadText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function normalizeList(json: any): Submission[] {
  if (Array.isArray(json)) return json;

  // common API shapes
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.submissions)) return json.data.submissions;
  if (Array.isArray(json?.submissions)) return json.submissions;

  return [];
}

/**
 * ✅ FIX: always normalize headers into a real Headers object
 * so TypeScript accepts it as HeadersInit.
 */
function buildHeaders(initHeaders?: HeadersInit) {
  const headers = new Headers(initHeaders);

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return headers;
}

export default function ApproveTaskPage() {
  const router = useRouter();
  const params = useParams<{ taskId: string }>();
  const taskId = params?.taskId;
  console.log("ApproveTaskPage mounted. taskId =", taskId);

  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ FIX: apiFetch now uses buildHeaders()
   */
  async function apiFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: buildHeaders(init.headers),
    // ✅ remove credentials to avoid CORS credential rules
    // credentials: "include",
  });
}
  async function load() {
  console.log("load() called. taskId =", taskId);
    if (!taskId) {
      setLoading(false);
      setRows([]);
      setError("Missing taskId in route. Navigate here with a taskId.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching submissions from:", API.listByTask(taskId));
      const res = await apiFetch(API.listByTask(taskId), { method: "GET" });
      console.log("Fetch done:", res.status, res.url);
      const text = await safeReadText(res);

      console.log("Fetching submissions from:", API.listByTask(taskId));

      if (!res.ok) {
        throw new Error(text || `Failed to load submissions (${res.status})`);
      }

      let json: any = null;
      try {
        json = text ? JSON.parse(text) : [];
      } catch {
        json = [];
      }

      setRows(normalizeList(json));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load submissions");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function approve(id: string) {
    if (!id) return;
    setBusyId(id);
    setError(null);

    try {
      const res = await apiFetch(API.approve(id), { method: MUTATION_METHOD });
      const text = await safeReadText(res);
      if (!res.ok) throw new Error(text || "Approve failed");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Approve failed");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: string) {
    if (!id) return;
    setBusyId(id);
    setError(null);

    try {
      const res = await apiFetch(API.reject(id), { method: MUTATION_METHOD });
      const text = await safeReadText(res);
      if (!res.ok) throw new Error(text || "Reject failed");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Reject failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <SideNav>
      <div className="page">
        <div className="headerRow">
          <button
            className="backBtn"
            aria-label="Back"
            onClick={() => router.back()}
          >
            ←
          </button>
          <div className="title">Approve Task</div>
        </div>

        <div className="lineWrap">
          <span className="dot" />
          <div className="line" />
          <span className="dot" />
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="spacer" />
        )}

        <div className="table">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="empty">No submissions yet.</div>
          ) : (
            rows.map((s, idx) => {
              const id = getId(s) || `${idx}`;
              const link = getLink(s);
              const date = formatDate(s.submittedAt ?? s.createdAt);

              return (
                <div className="row" key={id}>
                  <div className="cell link">
                    {link ? (
                      <a
                        className="linkText"
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link}
                      </a>
                    ) : (
                      <span className="linkText muted">No link</span>
                    )}
                  </div>

                  <div className="cell date">{date || "-"}</div>

                  <div className="cell actions">
                    <button
                      className="reject"
                      disabled={busyId === id}
                      onClick={() => reject(id)}
                    >
                      {busyId === id ? "..." : "Reject"}
                    </button>
                    <button
                      className="approve"
                      disabled={busyId === id}
                      onClick={() => approve(id)}
                    >
                      {busyId === id ? "..." : "Approve"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .page { padding: 22px 34px; }
        .headerRow { display: flex; align-items: center; gap: 14px; }
        .backBtn { border: none; background: transparent; font-size: 34px; cursor: pointer; line-height: 1; padding: 0 4px; }
        .title { font-size: 26px; font-weight: 800; color: #111; }
        .lineWrap { margin-top: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
        .line { flex: 1; height: 2px; background: rgba(0,0,0,.35); margin: 0 14px; }
        .dot { width: 6px; height: 6px; background: rgba(0,0,0,.55); border-radius: 999px; }
        .error { color: #b00020; font-size: 13px; margin-bottom: 10px; white-space: pre-wrap; }
        .spacer { height: 18px; }
        .table { width: 100%; margin-top: 10px; }
        .row { display: grid; grid-template-columns: 1.2fr 0.5fr 0.6fr; align-items: center; padding: 18px 8px; }
        .cell { display: flex; align-items: center; justify-content: center; }
        .cell.link { justify-content: flex-start; padding-left: 12px; }
        .linkText { color: #111; font-size: 12px; max-width: 240px; text-decoration: none; word-break: break-word; }
        .linkText.muted { color: rgba(0,0,0,.4); }
        .linkText:hover { text-decoration: underline; }
        .date { font-size: 12px; color: #111; }
        .actions { justify-content: flex-end; gap: 28px; padding-right: 18px; }
        .reject, .approve { border: none; background: transparent; cursor: pointer; font-weight: 500; font-size: 26px; }
        .reject { color: #d39a4a; }
        .approve { color: #0c8a2a; }
        .reject:disabled, .approve:disabled { opacity: .5; cursor: not-allowed; }
        .loading, .empty { padding: 30px 12px; color: rgba(0,0,0,.55); }
      `}</style>
    </SideNav>
  );
}